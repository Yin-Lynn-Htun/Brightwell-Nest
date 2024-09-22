import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomStatus } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTypeService } from 'src/room-type/room-type.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRespository: Repository<Room>,
    private readonly roomTypeRespository: RoomTypeService,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const roomType = await this.roomTypeRespository.findOne(
      createRoomDto.roomType,
    );

    if (!roomType) {
      throw new NotFoundException();
    }

    const room = this.roomRespository.create({
      name: createRoomDto.name,
      roomType: roomType,
      floorLevel: createRoomDto.floorLevel,
    });

    return await this.roomRespository.save(room);
  }

  async findAll(roomType?: string, status?: string): Promise<Room[]> {
    const queryBuilder = this.roomRespository.createQueryBuilder('room');

    // Apply roomType filter if provided
    if (roomType) {
      queryBuilder.andWhere('room.roomType = :roomType', { roomType });
    }

    // Apply status filter if provided
    if (status) {
      queryBuilder.andWhere('room.status = :status', { status });
    }

    // Return all rooms or filtered rooms based on the query
    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    return await this.roomRespository.findOne({
      where: {
        id,
      },
      relations: {
        roomType: true,
      },
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRespository.findOne({
      where: {
        id,
      },
    });

    if (!room) throw new NotFoundException();

    Object.assign(room, updateRoomDto);

    return await this.roomRespository.save(room);
  }

  async remove(id: number) {
    const room = await this.roomRespository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException();
    }

    return this.roomRespository.delete(room);
  }

  async getAvailableRoom() {
    return await this.roomRespository.find({
      where: {
        status: RoomStatus.Available,
      },
    });
  }
}
