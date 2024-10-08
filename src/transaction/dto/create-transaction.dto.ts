import {
  TransactionChannel,
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';

export class CreateTransactionDto {
  amount: number;
  type: TransactionType;
  channel?: TransactionChannel;
  referenceId?: number;
  status?: TransactionStatus;
}
