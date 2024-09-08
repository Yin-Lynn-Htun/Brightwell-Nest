import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    return await this.roomChargeRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateRoomChargeDto: UpdateRoomChargeDto) {
    const roomCharge = await this.roomChargeRepository.findOne({
      where: {
        id,
      },
    });

    if (!roomCharge) {
      throw new NotFoundException();
    }

    Object.assign(roomCharge, updateRoomChargeDto);

    return await this.roomChargeRepository.save(roomCharge);
  }

  remove(id: number) {
    return `This action removes a #${id} roomCharge`;
  }

  async removeWithEntity(item: RoomCharge) {
    return await this.roomChargeRepository.remove(item);
  }
}
