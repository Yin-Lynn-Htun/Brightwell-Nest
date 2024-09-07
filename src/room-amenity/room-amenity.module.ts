import { Module } from '@nestjs/common';
import { RoomAmenityService } from './room-amenity.service';
import { RoomAmenityController } from './room-amenity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomAmenity } from './entities/room-amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomAmenity])],
  controllers: [RoomAmenityController],
  providers: [RoomAmenityService],
  exports: [RoomAmenityService],
})
export class RoomAmenityModule {}
