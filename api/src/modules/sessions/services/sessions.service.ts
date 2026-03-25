import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSessionDto } from '../dto/create-session.dto';

import { Seat } from '../../seats/entities/seat.entity';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}
  
  async create(dto: CreateSessionDto) {

    const session = this.sessionRepository.create({
      movie: dto.movie,
      startTime: dto.startTime,
      totalSeats: dto.totalSeats
    });

    await this.sessionRepository.save(session);

    const seats: Seat[] = Array.from({ length: dto.totalSeats }, (_, index) =>
      this.seatRepository.create({
        seatNumber: index + 1,
        session
      })
    );

    await this.seatRepository.save(seats);

    return session;
  }
  
  async getSeats(sessionId: number) {
    return this.seatRepository.find({
      where: { sessionId },
      select: ['id', 'seatNumber', 'isBooked'],
      order: { seatNumber: 'ASC' },
    });
  }
}