import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeController } from './room-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './entities/room-type.entity';
import { RoomChargeModule } from 'src/room-charge/room-charge.module';
import { RoomAmenityModule } from 'src/room-amenity/room-amenity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomType]),
    RoomChargeModule,
    RoomAmenityModule,
  ],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
  exports: [RoomTypeService],
})
export class RoomTypeModule {}
