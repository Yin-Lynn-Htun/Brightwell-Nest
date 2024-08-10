import { PartialType } from '@nestjs/swagger';
import { CreateDoctorEduDto } from './create-doctor-edu.dto';

export class UpdateDoctorEduDto extends PartialType(CreateDoctorEduDto) {}
