import { PartialType } from '@nestjs/swagger';
import { CreateDepositDto } from './create-deposit.dto';
import { DepositStatus } from '../entities/deposit.entity';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {
  transactionId: number;
  status: DepositStatus;
}
