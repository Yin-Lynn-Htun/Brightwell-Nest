import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomChargeService } from './room-charge.service';
import { CreateRoomChargeDto } from './dto/create-room-charge.dto';
import { UpdateRoomChargeDto } from './dto/update-room-charge.dto';

@Controller('room-charge')
export class RoomChargeController {
  constructor(private readonly roomChargeService: RoomChargeService) {}

  @Post()
  create(@Body() createRoomChargeDto: CreateRoomChargeDto) {
    return this.roomChargeService.create(createRoomChargeDto);
  }

  @Get()
  findAll() {
    return this.roomChargeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomChargeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomChargeDto: UpdateRoomChargeDto) {
    return this.roomChargeService.update(+id, updateRoomChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomChargeService.remove(+id);
  }
}
