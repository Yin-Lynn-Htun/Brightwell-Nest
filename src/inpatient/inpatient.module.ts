import { Module } from '@nestjs/common';
import { InpatientService } from './inpatient.service';
import { InpatientController } from './inpatient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inpatient } from './entities/inpatient.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { RoomModule } from 'src/room/room.module';
import { RoomTypeModule } from 'src/room-type/room-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inpatient]),
    PatientsModule,
    RoomModule,
    RoomTypeModule,
  ],
  controllers: [InpatientController],
  providers: [InpatientService],
})
export class InpatientModule {}
