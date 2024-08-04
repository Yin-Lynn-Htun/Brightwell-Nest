import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly specialitiesRespository: Repository<Role>,
  ) {}

  async create(createSpecialityDto: CreateRoleDto) {
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

  async update(id: number, updateSpecialityDto: UpdateRoleDto) {
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
