import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRespository: Repository<Staff>,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    const staff = this.staffRespository.create(createStaffDto);
    return await this.staffRespository.save(staff);
  }

  async findAll() {
    return await this.staffRespository.find({
      relations: {
        role: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.staffRespository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException();
    }

    Object.assign(city, updateStaffDto);

    return await this.staffRespository.save(city);
  }

  async remove(id: number) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException();
    }

    return await this.staffRespository.remove(city);
  }
}
