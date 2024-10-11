import { Injectable, NotFoundException } from '@nestjs/common';
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
        if (!amenity.id) {
          return await this.roomAmenityRespository.create({
            name: amenity.name,
          });
        } else {
          const val = await this.roomAmenityRespository.findOne(+amenity.id);

          if (!val) {
            return await this.roomAmenityRespository.create({
              name: amenity.name,
            });
          }
          return val;
        }
      }),
    );

    const chargeList: RoomCharge[] = [];

    for (const charge of charges) {
      const c = await this.roomChargeRespository.create(charge);
      chargeList.push(c);
    }

    const roomType = this.roomTypeRespository.create({
      name: createRoomTypeDto.name,
      amenities: amenityList,
      charges: chargeList,
      description: createRoomTypeDto.description,
      images: createRoomTypeDto.images,
    });

    return await this.roomTypeRespository.save(roomType);
  }

  async findAll() {
    return await this.roomTypeRespository.find({
      relations: {
        amenities: true,
        charges: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.roomTypeRespository.findOne({
      where: {
        id: id,
      },
      relations: {
        amenities: true,
        charges: true,
      },
    });
  }

  async update(id: number, updateRoomTypeDto: UpdateRoomTypeDto) {
    const roomType = await this.roomTypeRespository.findOne({
      where: {
        id,
      },
    });

    if (!roomType) {
      throw new NotFoundException();
    }

    if (updateRoomTypeDto.name) {
      roomType.name = updateRoomTypeDto.name;
    }

    if (updateRoomTypeDto.description) {
      roomType.description = updateRoomTypeDto.description;
    }

    // amenities start
    const incomingAmenities = updateRoomTypeDto.amenities ?? [];
    const updatedAmenities = [];

    for (const amenity of incomingAmenities) {
      if (amenity.id) {
        const item = await this.roomAmenityRespository.findOne(amenity.id);

        if (!item) {
          throw new NotFoundException();
        }

        updatedAmenities.push(item);
      } else {
        const item = await this.roomAmenityRespository.create({
          name: amenity.name,
        });
        updatedAmenities.push(item);
      }
    }
    roomType.amenities = updatedAmenities;
    // amenities end

    // charges start
    const incomingCharges = updateRoomTypeDto.charges ?? [];
    const existingCharges = roomType.charges ?? [];

    // remove charge items
    const incomingChargeIds = incomingCharges
      ?.filter((i) => i.id)
      .map((i) => i.id);

    const chargesToRemove = existingCharges.filter(
      (e) => !incomingChargeIds?.includes(+e.id),
    );

    if (chargesToRemove.length > 0) {
      for (const id of chargesToRemove) {
        this.roomChargeRespository.removeWithEntity(id);
      }
    }

    // charge to insert

    const updatedCharges = [];
    for (const charge of incomingCharges) {
      // insert
      if (!charge.id) {
        const c = await this.roomChargeRespository.create(charge);
        updatedCharges.push(c);
      } else {
        const foundCharge = await this.roomChargeRespository.findOne(id);

        if (!foundCharge) {
          throw new NotFoundException();
        }

        if (foundCharge?.price === charge.price) {
          updatedCharges.push(foundCharge);
        } else {
          // need to update
          const updatedItem = await this.roomChargeRespository.update(
            charge.id,
            {
              ...charge,
            },
          );

          updatedCharges.push(updatedItem);
        }
      }
    }
    roomType.charges = updatedCharges;
    // charges end

    this.roomTypeRespository.save(roomType);
  }

  remove(id: number) {
    return `This action removes a #${id} roomType`;
  }
}
