import { Injectable } from '@nestjs/common';
import { CreateRoomAmenityDto } from './dto/create-room-amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room-amenity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomAmenity } from './entities/room-amenity.entity';

@Injectable()
export class RoomAmenityService {
  constructor(
    @InjectRepository(RoomAmenity)
    private amenityRepository: Repository<RoomAmenity>,
  ) {}

  async create(createRoomAmenityDto: CreateRoomAmenityDto) {
    const amenity = this.amenityRepository.create(createRoomAmenityDto);
    return await this.amenityRepository.save(amenity);
  }

  async findAll() {
    return await this.amenityRepository.find();
  }

  async findOne(id: number) {
    return await this.amenityRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateRoomAmenityDto: UpdateRoomAmenityDto) {
    return `This action updates a #${id} roomAmenity`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomAmenity`;
  }
}
