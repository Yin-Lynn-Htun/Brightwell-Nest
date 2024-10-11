import { CreateRoomAmenityDto } from 'src/room-amenity/dto/create-room-amenity.dto';
import { CreateRoomChargeDto } from 'src/room-charge/dto/create-room-charge.dto';

export class CreateRoomTypeDto {
  name: string;
  description: string;
  images: string[];
  charges: (CreateRoomChargeDto & { id: number | undefined })[];
  amenities: (CreateRoomAmenityDto & { id: number | undefined })[];
}
