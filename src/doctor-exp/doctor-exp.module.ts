import { Module } from '@nestjs/common';
import { DoctorExpService } from './doctor-exp.service';
import { DoctorExpController } from './doctor-exp.controller';

@Module({
  controllers: [DoctorExpController],
  providers: [DoctorExpService],
})
export class DoctorExpModule {}
