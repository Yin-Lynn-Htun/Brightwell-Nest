import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/constants';
@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRespository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const patient = this.patientsRespository.create({
      ...createPatientDto,
      password: await bcrypt.hash(
        createPatientDto.password || 'test123!',
        saltOrRounds,
      ),
    });

    return await this.patientsRespository.save(patient);
  }

  async findAll() {
    return await this.patientsRespository.find();
  }

  async findOne(id: number) {
    return await this.patientsRespository.findOneBy({
      id,
    });
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findOne(id);

    if (!patient) {
      throw new NotFoundException();
    }

    Object.assign(patient, updatePatientDto);

    const data = await this.patientsRespository.save(patient);
    return { ...data, responseMessage: 'Patient updated successfully!' };
  }

  async remove(id: number) {
    const patient = await this.findOne(id);

    if (!patient) {
      throw new NotFoundException();
    }

    const data = await this.patientsRespository.remove(patient);
    return { ...data, responseMessage: 'Patient deleted successfully!' };
  }

  async findByEmail(email: string) {
    return await this.patientsRespository.findOneBy({
      email,
    });
  }
}
