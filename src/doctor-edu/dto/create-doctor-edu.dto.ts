import { IsDateString, IsEnum, IsString, Length } from 'class-validator';
import { Degree } from '../entities/doctor-edu.entity';
import { Column } from 'typeorm';

export class CreateDoctorEduDto {
  @IsEnum(Degree)
  degree: Degree;

  @IsString()
  @Length(1, 50)
  institution: string;

  @IsString()
  @Length(1, 50)
  fieldOfStudy: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
