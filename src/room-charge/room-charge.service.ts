import { Injectable } from '@nestjs/common';
import { CreateRoomChargeDto } from './dto/create-room-charge.dto';
import { UpdateRoomChargeDto } from './dto/update-room-charge.dto';
import { Repository } from 'typeorm';
import { RoomCharge } from './entities/room-charge.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomChargeService {
  constructor(
    @InjectRepository(RoomCharge)
    private roomChargeRepository: Repository<RoomCharge>,
  ) {}

  async create(createRoomChargeDto: CreateRoomChargeDto) {
    const tag = this.roomChargeRepository.create(createRoomChargeDto);
    return await this.roomChargeRepository.save(tag);
  }

  async findAll() {
    return await this.roomChargeRepository.find();
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
