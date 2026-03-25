import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SessionsService } from '../services/sessions.service';
import { CreateSessionDto } from '../dto/create-session.dto';

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Post()
    create(@Body() dto: CreateSessionDto) {
        return this.sessionsService.create(dto);
    }

    @Get(':id/seats')
    getSeats(@Param('id', ParseIntPipe) id: number) {
        return this.sessionsService.getSeats(id);
    }
}
