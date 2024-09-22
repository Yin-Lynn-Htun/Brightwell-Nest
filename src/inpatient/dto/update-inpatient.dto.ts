import { PartialType } from '@nestjs/swagger';
import { CreateInpatientDto } from './create-inpatient.dto';

export class UpdateInpatientDto extends PartialType(CreateInpatientDto) {}
