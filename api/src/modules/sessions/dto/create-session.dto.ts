import { IsString, IsDateString, IsInt, Min } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  movie: string;

  @IsDateString()
  startTime: Date;

  @IsInt()
  @Min(1)
  totalSeats: number;
}