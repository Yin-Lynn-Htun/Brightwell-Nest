import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorEduDto } from './dto/create-doctor-edu.dto';
import { UpdateDoctorEduDto } from './dto/update-doctor-edu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEdu } from './entities/doctor-edu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DoctorEduService {
  constructor(
    @InjectRepository(DoctorEdu)
    private readonly doctorEduRepository: Repository<DoctorEdu>,
  ) {}

  async create(createDoctorEduDto: CreateDoctorEduDto) {
    const docEdu = this.doctorEduRepository.create(createDoctorEduDto);

    return await this.doctorEduRepository.save(docEdu);
  }

  async findAll() {
    return await this.doctorEduRepository.find();
  }
  async findOne(id: number) {
    return await this.doctorEduRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateDoctorEduDto: UpdateDoctorEduDto) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException();
    }

    Object.assign(city, updateDoctorEduDto);

    return await this.doctorEduRepository.save(city);
  }

  async remove(id: number) {
    const docEdu = await this.findOne(id);

    if (!docEdu) {
      throw new NotFoundException();
    }

    return await this.doctorEduRepository.remove(docEdu);
  }
}
