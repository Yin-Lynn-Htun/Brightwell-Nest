import { PartialType } from '@nestjs/swagger';
import { CreateInpatientChargeDto } from './create-inpatient-charge.dto';

export class UpdateInpatientChargeDto extends PartialType(CreateInpatientChargeDto) {}
