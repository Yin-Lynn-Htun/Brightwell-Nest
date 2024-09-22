import { forwardRef, Module } from '@nestjs/common';
import { InpatientService } from './inpatient.service';
import { InpatientController } from './inpatient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inpatient } from './entities/inpatient.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { RoomModule } from 'src/room/room.module';
import { RoomTypeModule } from 'src/room-type/room-type.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { DepositModule } from 'src/deposit/deposit.module';

@Module({
  imports: [
    forwardRef(() => DepositModule),
    TypeOrmModule.forFeature([Inpatient]),
    PatientsModule,
    RoomModule,
    RoomTypeModule,
    TransactionModule,
  ],
  controllers: [InpatientController],
  providers: [InpatientService],
  exports: [InpatientService],
})
export class InpatientModule {}
