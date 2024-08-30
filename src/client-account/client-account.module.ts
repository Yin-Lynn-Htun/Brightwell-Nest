import { Module } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { ClientAccountController } from './client-account.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';

@Module({
  imports: [PatientsModule, TypeOrmModule.forFeature([Patient])],
  controllers: [ClientAccountController],
  providers: [ClientAccountService],
})
export class ClientAccountModule {}
