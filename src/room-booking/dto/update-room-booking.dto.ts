import { PartialType } from '@nestjs/swagger';
import { CreateRoomBookingDto } from './create-room-booking.dto';

export class UpdateRoomBookingDto extends PartialType(CreateRoomBookingDto) {}
