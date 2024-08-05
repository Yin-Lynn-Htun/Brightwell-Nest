import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly staffRespository: Repository<User>,
  ) {}

  async create(createStaffDto: CreateUserDto) {
    const staff = this.staffRespository.create(createStaffDto);
    return await this.staffRespository.save(staff);
  }

  async findAll() {
    return await this.staffRespository.find();
  }

  async findOne(id: number) {
    return await this.staffRespository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateStaffDto: UpdateUserDto) {
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
