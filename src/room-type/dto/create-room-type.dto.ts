import { CreateRoomChargeDto } from 'src/room-charge/dto/create-room-charge.dto';

export class CreateRoomTypeDto {
  name: string;
  description: string;
  charges: CreateRoomChargeDto[];
  amenities: string[];
}
