import { Body, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { patients } from 'src/dummy/patients';

@Injectable()
export class PatientsService {
  create(@Body() createPatientDto: CreatePatientDto) {
    return {
      ...createPatientDto,
    };
  }

  findAll() {
    return patients;
  }

  findOne(id: number) {
    return patients.find((patient) => patient.id === id);
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
