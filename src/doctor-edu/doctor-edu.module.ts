import { Module } from '@nestjs/common';
import { DoctorEduService } from './doctor-edu.service';
import { DoctorEduController } from './doctor-edu.controller';
import { DoctorEdu } from './entities/doctor-edu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEdu])],
  controllers: [DoctorEduController],
  providers: [DoctorEduService],
  exports: [DoctorEduService],
})
export class DoctorEduModule {}
