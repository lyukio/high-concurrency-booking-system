import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { Booking } from "../entities/booking.entity";
import { Seat } from "src/modules/seats/entities/seat.entity";
import { CreateBookingDto } from "../dto/create-booking.dto";

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,

        @InjectRepository(Seat)
        private seatRepository: Repository<Seat>,

        private dataSource: DataSource,
    ) {}

    async create(dto: CreateBookingDto) {
        return this.dataSource.transaction(async (manager) => {
            const seat = await manager.findOne(Seat, {
                where: {
                    id: dto.seatId,
                    isBooked: false
                },
                lock: { mode: 'pessimistic_write' }
            });

            if (!seat) {
                throw new NotFoundException('Seat not found or already booked');
            }

            const booking = this.bookingRepository.create({
                seat,
                userEmail: dto.userEmail
            });

            seat.isBooked = true;

            await manager.save(seat);
            await manager.save(booking);

            return booking;
        });
    }

    async cancelBooking(id: number) {

        return this.dataSource.transaction(async manager => {
            const booking = await manager.findOne(Booking, {
                where: { id },
                relations: ['seat'],
                lock: { mode: 'pessimistic_write' }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            booking.seat.isBooked = false;

            await manager.save(booking.seat);

            await manager.softRemove(booking);

            return { message: 'Booking cancelled' };
        });
    }
}