import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { SlotModule } from 'src/slot/slot.module';
import { Slot } from 'src/slot/entities/slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Slot]),
    PatientsModule,
    ScheduleModule,
    SlotModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
