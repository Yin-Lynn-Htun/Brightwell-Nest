import { Injectable } from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomType } from './entities/room-type.entity';
import { Repository } from 'typeorm';
import { RoomChargeService } from 'src/room-charge/room-charge.service';
import { RoomAmenityService } from 'src/room-amenity/room-amenity.service';
import { RoomCharge } from 'src/room-charge/entities/room-charge.entity';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRespository: Repository<RoomType>,
    private readonly roomChargeRespository: RoomChargeService,
    private readonly roomAmenityRespository: RoomAmenityService,
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto) {
    const { charges, amenities } = createRoomTypeDto;

    const amenityList = await Promise.all(
      amenities.map(async (amenity) => {
        if (isNaN(amenity as any)) {
          return await this.roomAmenityRespository.create(amenity);
        } else {
          const val = await this.roomAmenityRespository.findOne(+amenity);

          if (!val) {
            return await this.roomAmenityRespository.create(amenity);
          }
          return val;
        }
      }),
    );

    const chargeList: RoomCharge[] = [];

    charges.forEach(async (item) => {
      const charge = await this.roomChargeRespository.create(item);
      chargeList.push(charge);
    });

    const roomType = this.roomTypeRespository.create({
      name: createRoomTypeDto.name,
      amenities: amenityList,
      charges: chargeList,
      description: createRoomTypeDto.description,
    });

    return await this.roomTypeRespository.save(roomType);
  }

  findAll() {
    return `This action returns all roomType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomType`;
  }

  update(id: number, updateRoomTypeDto: UpdateRoomTypeDto) {
    return `This action updates a #${id} roomType`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomType`;
  }
}
