import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly staffRespository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password || 'test123!';
    const hash = await bcrypt.hash(password, saltOrRounds);

    const staff = this.staffRespository.create({
      ...createUserDto,
      password: hash,
    });

    return await this.staffRespository.save(staff);
  }

  async findAll() {
    return await this.staffRespository.find();
  }

  async findOne(id: number) {
    return await this.staffRespository.findOne({
      where: { userId: id },
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
