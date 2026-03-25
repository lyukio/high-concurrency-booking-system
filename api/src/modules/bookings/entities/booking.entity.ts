import { Entity, ManyToOne, Column, Index } from 'typeorm';
import { Seat } from '../../seats/entities/seat.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Booking extends BaseEntity {
  @Column()
  userEmail: string;

  @ManyToOne(() => Seat)
  seat: Seat;
}