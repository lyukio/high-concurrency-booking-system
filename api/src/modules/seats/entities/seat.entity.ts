import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Session } from "../../sessions/entities/session.entity";
import { BaseEntity } from "src/common/entities/base.entity";

@Entity()
export class Seat extends BaseEntity {
  @Column()
  sessionId: number;

  @Column()
  seatNumber: number;

  @Column({ default: false })
  isBooked: boolean;

  @ManyToOne(() => Session, (session) => session.seats)
  @JoinColumn({ name: "sessionId" })
  session: Session;
}