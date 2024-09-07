import { PartialType } from '@nestjs/swagger';
import { CreateRoomChargeDto } from './create-room-charge.dto';

export class UpdateRoomChargeDto extends PartialType(CreateRoomChargeDto) {}
