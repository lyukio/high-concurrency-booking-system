import { Module } from '@nestjs/common';
import { SessionsController } from './controllers/sessions.controller';
import { SessionsService } from './services/sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Seat } from '../seats/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Seat])],
  controllers: [SessionsController],
  providers: [SessionsService]
})
export class SessionsModule {}
