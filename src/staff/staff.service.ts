import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import { Role, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRespository: Repository<Staff>,
    private readonly userRespository: UserService,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    const user = await this.userRespository.create({
      ...createStaffDto,
    });

    const staff = this.staffRespository.create({
      user,
      ...createStaffDto,
    });

    const data = await this.staffRespository.save(staff);
    return { ...data, responseMessage: 'Staff created successfully!' };
  }

  async findAll() {
    const staffs = await this.staffRespository.find({
      relations: {
        user: true,
      },
    });

    const transformedStaffMembers = staffs.map((staff) => {
      const temp = {
        ...staff,
        ...staff.user,
      };

      // @ts-ignore
      delete temp.user;

      return temp;
    });

    return transformedStaffMembers;
  }

  async findOne(id: number) {
    const staff = await this.staffRespository.findOne({
      where: { staffId: id },
      relations: {
        user: true,
      },
    });

    if (!staff) {
      throw new NotFoundException();
    }

    const transformStaff = {
      ...staff?.user,
      ...staff,
    };

    // @ts-ignore
    delete transformStaff.user;

    return transformStaff;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const staff = await this.staffRespository.findOne({
      where: {
        staffId: id,
      },
      relations: ['user'],
    });

    if (!staff) {
      throw new NotFoundException();
    }

    Object.assign(staff, updateStaffDto);

    await this.userRespository.update(staff.user.userId, updateStaffDto);
    return await this.staffRespository.save(staff);
  }

  async remove(id: number) {
    const staff = await this.findOne(id);

    if (!staff) {
      throw new NotFoundException();
    }

    await this.staffRespository.remove(staff);
    const data = await this.userRespository.remove(staff.userId);
    return { ...data, responseMessage: 'Delete staff successfully!' };
  }
}
