import { Module } from '@nestjs/common';
import { RoomChargeService } from './room-charge.service';
import { RoomChargeController } from './room-charge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomCharge } from './entities/room-charge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomCharge])],
  controllers: [RoomChargeController],
  providers: [RoomChargeService],
  exports: [RoomChargeService],
})
export class RoomChargeModule {}
