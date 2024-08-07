// create-staff.dto.ts
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmploymentType } from '../entities/staff.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateStaffDto extends CreateUserDto {
  // Personal details
  @IsString()
  @Length(1, 50)
  idType: string;

  @IsString()
  @Length(1, 50)
  idNumber: string;

  // Employment details
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  position: string;

  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  department: string;

  @IsDateString()
  employmentStartDate: string;

  @IsOptional()
  @IsDateString()
  employmentEndDate?: string;

  @IsOptional()
  @IsString()
  isCurrentlyWorking?: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsString()
  @Length(1, 20)
  staffPassNo: string;
}
