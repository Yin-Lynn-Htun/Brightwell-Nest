import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { UserModule } from 'src/user/user.module';
import { DoctorEduModule } from 'src/doctor-edu/doctor-edu.module';
import { SpecialitiesModule } from 'src/specialities/specialities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    UserModule,
    DoctorEduModule,
    SpecialitiesModule,
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
