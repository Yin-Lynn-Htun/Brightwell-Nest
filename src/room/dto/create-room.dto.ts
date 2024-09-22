import { RoomStatus } from '../entities/room.entity';

export class CreateRoomDto {
  name: string;
  floorLevel: string;
  roomType: number;
  status: RoomStatus;
}
