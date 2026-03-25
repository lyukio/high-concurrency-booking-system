import { Body, Delete, Param, Post } from "@nestjs/common";
import { CreateBookingDto } from "../dto/create-booking.dto";
import { BookingsService } from "../services/bookings.service";

export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    create(@Body() dto: CreateBookingDto) {
        return this.bookingsService.create(dto);
    }

    @Delete(':id')
    cancel(@Param('id') id: number) {
        return this.bookingsService.cancelBooking(Number(id));
    }
}