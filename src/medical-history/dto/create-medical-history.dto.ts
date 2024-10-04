import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MedicalHistoryCategory } from '../entities/medical-history.entity';

export class CreateMedicalHistoryDto {
  @IsString()
  category: MedicalHistoryCategory;

  @IsString()
  @IsNotEmpty()
  description: string;
}
