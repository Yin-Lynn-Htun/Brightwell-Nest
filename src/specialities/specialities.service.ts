import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Speciality } from './entities/speciality.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialitiesService {
  constructor(
    @InjectRepository(Speciality)
    private readonly specialitiesRespository: Repository<Speciality>,
  ) {}

  async create(createSpecialityDto: CreateSpecialityDto) {
    const speciality = this.specialitiesRespository.create(createSpecialityDto);

    return await this.specialitiesRespository.save(speciality);
  }

  async findAll() {
    return await this.specialitiesRespository.find();
  }

  async findOne(id: number) {
    return await this.specialitiesRespository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateSpecialityDto: UpdateSpecialityDto) {
    const speciality = await this.specialitiesRespository.findOne({
      where: {
        id,
      },
    });

    if (!speciality) {
      throw new NotFoundException();
    }

    Object.assign(speciality, updateSpecialityDto);

    return await this.specialitiesRespository.save(speciality);
  }

  async remove(id: number) {
    const speciality = await this.specialitiesRespository.findOne({
      where: {
        id,
      },
    });

    if (!speciality) {
      throw new NotFoundException();
    }

    return await this.specialitiesRespository.remove(speciality);
  }
}
