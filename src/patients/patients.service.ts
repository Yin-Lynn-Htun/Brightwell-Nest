import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { patients } from 'src/dummy/patients';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRespository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const patient = this.patientsRespository.create(createPatientDto);

    return await this.patientsRespository.save(patient);
  }

  async findAll() {
    return await this.patientsRespository.find();
  }

  async findOne(id: number) {
    return await this.patientsRespository.findOne({
      where: { id },
    });
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException();
    }

    Object.assign(city, updatePatientDto);

    return await this.patientsRespository.save(city);
  }

  async remove(id: number) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException();
    }

    return await this.patientsRespository.remove(city);
  }
}
