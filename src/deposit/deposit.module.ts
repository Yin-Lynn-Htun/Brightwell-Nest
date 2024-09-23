import { Module, forwardRef } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { InpatientModule } from 'src/inpatient/inpatient.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    forwardRef(() => InpatientModule),
    TransactionModule,
    TypeOrmModule.forFeature([Deposit]),
  ],
  controllers: [DepositController],
  providers: [DepositService],
  exports: [DepositService],
})
export class DepositModule {}
