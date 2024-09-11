import { Module } from '@nestjs/common';
import { RoomBookingService } from './room-booking.service';
import { RoomBookingController } from './room-booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomBooking } from './entities/room-booking.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomBooking]),
    PatientsModule,
    RoomModule,
  ],
  controllers: [RoomBookingController],
  providers: [RoomBookingService],
})
export class RoomBookingModule {}
