import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseDto } from './create-purchase.dto';
import { PurchaseStatus } from 'src/constants';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  status: PurchaseStatus;
}
