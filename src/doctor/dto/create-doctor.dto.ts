// create-staff.dto.ts
import { IsArray, IsString, Length } from 'class-validator';
import { CreateDoctorEduDto } from 'src/doctor-edu/dto/create-doctor-edu.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateDoctorDto extends CreateUserDto {
  specialties: string[];

  languages: string[];

  educations: CreateDoctorEduDto[];

  // Personal details
  @IsString()
  @Length(1, 50)
  idType: string;

  @IsString()
  @Length(1, 50)
  idNumber: string;
}
