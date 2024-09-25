import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';

export class CreateTransactionDto {
  amount: number;
  type: TransactionType;
  referenceId?: number;
  status?: TransactionStatus;
}
