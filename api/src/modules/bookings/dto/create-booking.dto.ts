import { IsEmail, IsInt, Min } from 'class-validator';

export class CreateBookingDto {

  //Mudança para seatId para melhor performance e simplicidade na query
  @IsInt()
  seatId: number;

  // @IsInt()
  // @Min(1)
  // sessionId: number;

  // @IsInt()
  // @Min(1)
  // seatNumber: number;

  @IsEmail()
  userEmail: string;

}