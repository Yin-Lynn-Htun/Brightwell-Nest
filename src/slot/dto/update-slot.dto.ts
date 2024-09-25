import { PartialType } from '@nestjs/swagger';
import { CreateSlotDto } from './create-slot.dto';
import { SlotStatus } from '../entities/slot.entity';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {
  status: SlotStatus;
}
