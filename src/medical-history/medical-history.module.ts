import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalHistory]),
    PatientsModule,
    UserModule,
  ],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryModule {}
