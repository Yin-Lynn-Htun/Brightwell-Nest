import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalHistory]),
    PatientsModule,
    DoctorModule,
  ],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryModule {}
