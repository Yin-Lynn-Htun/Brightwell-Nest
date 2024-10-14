import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Inpatient } from 'src/inpatient/entities/inpatient.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Transaction,
      Inpatient,
      Purchase,
      Doctor,
      Patient,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
