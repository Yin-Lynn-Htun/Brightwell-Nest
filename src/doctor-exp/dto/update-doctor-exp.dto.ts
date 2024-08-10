import { PartialType } from '@nestjs/swagger';
import { CreateDoctorExpDto } from './create-doctor-exp.dto';

export class UpdateDoctorExpDto extends PartialType(CreateDoctorExpDto) {}
