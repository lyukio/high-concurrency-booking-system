import { Entity, Column, OneToMany } from "typeorm";
import { Seat } from '../../seats/entities/seat.entity';
import { BaseEntity } from "src/common/entities/base.entity";

@Entity()
export class Session extends BaseEntity {
  @Column()
  movie: string;

  @Column()
  startTime: Date;

  @Column()
  totalSeats: number;

  @OneToMany(() => Seat, (seat) => seat.session)
  seats: Seat[];
}