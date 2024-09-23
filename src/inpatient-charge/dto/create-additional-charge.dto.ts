import { PartialType } from '@nestjs/swagger';
import { CreateInpatientChargeDto } from './create-inpatient-charge.dto';

export class CreateAdditionalChargeDto {
  charges: Omit<CreateInpatientChargeDto, 'inpatientId'>;
}
