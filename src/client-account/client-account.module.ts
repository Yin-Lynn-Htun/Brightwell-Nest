import { Module } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { ClientAccountController } from './client-account.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  imports: [PatientsModule, TypeOrmModule.forFeature([Patient, Transaction])],
  controllers: [ClientAccountController],
  providers: [ClientAccountService],
})
export class ClientAccountModule {}
