import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/constants';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRespository: Repository<Doctor>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password || 'test123!';
    const hash = await bcrypt.hash(password, saltOrRounds);

    const staff = this.userRespository.create({
      ...createUserDto,
      password: hash,
    });

    return await this.userRespository.save(staff);
  }

  async findAll() {
    return await this.userRespository.find();
  }

  async findOne(id: number) {
    const data = await this.userRespository.findOne({
      where: { userId: id },
    });

    let doctorId = null;

    if (data?.role === Role.Doctor) {
      const doctor = await this.doctorRespository.findOne({
        where: {
          user: {
            userId: data?.userId,
          },
        },
      });

      if (!doctor) throw new NotFoundException('Doctor not found!');

      doctorId = doctor.doctorId;
    }

    return { ...data, doctorId };
  }
}
