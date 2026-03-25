import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { AppLogger } from "src/common/logger/app-logger.service";
import { Booking } from "../entities/booking.entity";
import { Seat } from "src/modules/seats/entities/seat.entity";
import { CreateBookingDto } from "../dto/create-booking.dto";

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        private dataSource: DataSource,
        private logger: AppLogger,
    ) {}

    async create(dto: CreateBookingDto) {
        return this.dataSource.transaction(async (manager) => {
            this.logger.debug('Trying to lock seat to create booking', 'BookingService', {
                seatId: dto.seatId,
                userEmail: dto.userEmail
            });

            const seat = await manager.findOne(Seat, {
                where: {
                    id: dto.seatId,
                    isBooked: false
                },
                lock: { mode: 'pessimistic_write' }
            });

            this.logger.debug('Seat lock result', 'BookingService', {
                seatId: dto.seatId,
                found: !!seat,
            });

            if (!seat) {
                this.logger.warn('Seat not found or already booked', 'BookingService', {
                    seatId: dto.seatId,
                    userEmail: dto.userEmail
                });
                throw new NotFoundException('Seat not found or already booked');
            }

            this.logger.log(`Creating booking for seat`, 'BookingService', {
                seatId: seat.id,
                userEmail: dto.userEmail
            });

            const booking = this.bookingRepository.create({
                seat,
                userEmail: dto.userEmail
            });

            seat.isBooked = true;

            await manager.save(seat);
            await manager.save(booking);

            this.logger.log('Booking created successfully', 'BookingService', {
                seatId: seat.id
            });

            return booking;
        });
    }

    async cancelBooking(id: number) {
        return this.dataSource.transaction(async manager => {
            this.logger.debug('Trying to lock booking to cancel it', 'BookingService', {
                bookingId: id
            });

            const booking = await manager.findOne(Booking, {
                where: { id },
                relations: ['seat'],
                lock: { mode: 'pessimistic_write' }
            });

            this.logger.debug('Booking lock result', 'BookingService', {
                bookingId: id,
                found: !!booking,
            });

            if (!booking) {
                this.logger.warn('Booking not found', 'BookingService', {
                    bookingId: id
                });
                throw new NotFoundException('Booking not found');
            }

            this.logger.log('Cancelling booking', 'BookingService', {
                bookingId: id,
                seatId: booking.seat.id
            });

            booking.seat.isBooked = false;

            await manager.save(booking.seat);

            await manager.softRemove(booking);

            this.logger.log('Booking cancelled successfully', 'BookingService', {
                bookingId: id,
                seatId: booking.seat.id
            });

            return { message: 'Booking cancelled' };
        });
    }
}