import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { RoomModule } from 'src/room/room.module';
import { Slot } from 'src/slot/entities/slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Slot]),
    DoctorModule,
    RoomModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
