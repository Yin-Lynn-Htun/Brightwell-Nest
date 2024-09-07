import { Injectable } from '@nestjs/common';
import { CreateRoomChargeDto } from './dto/create-room-charge.dto';
import { UpdateRoomChargeDto } from './dto/update-room-charge.dto';

@Injectable()
export class RoomChargeService {
  create(createRoomChargeDto: CreateRoomChargeDto) {
    return 'This action adds a new roomCharge';
  }

  findAll() {
    return `This action returns all roomCharge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomCharge`;
  }

  update(id: number, updateRoomChargeDto: UpdateRoomChargeDto) {
    return `This action updates a #${id} roomCharge`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomCharge`;
  }
}
