import { Module } from '@nestjs/common';
import { RoomChargeService } from './room-charge.service';
import { RoomChargeController } from './room-charge.controller';

@Module({
  controllers: [RoomChargeController],
  providers: [RoomChargeService],
})
export class RoomChargeModule {}
