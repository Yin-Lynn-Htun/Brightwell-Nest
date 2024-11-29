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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    console.log(updateUserDto, 'updateUserDto');
    Object.assign(user, updateUserDto);
    return await this.userRespository.save(user);
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

  async findOneWithoutUser(id: number) {
    const data = await this.userRespository.findOne({
      where: {
        userId: id,
      },
    });

    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRespository.findOne({ where: { email } });
  }

  async remove(id: number) {
    const user = await this.userRespository.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRespository.remove(user);
  }
}
