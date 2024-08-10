import { Injectable } from '@nestjs/common';
import { CreateDoctorExpDto } from './dto/create-doctor-exp.dto';
import { UpdateDoctorExpDto } from './dto/update-doctor-exp.dto';

@Injectable()
export class DoctorExpService {
  create(createDoctorExpDto: CreateDoctorExpDto) {
    return 'This action adds a new doctorExp';
  }

  findAll() {
    return `This action returns all doctorExp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorExp`;
  }

  update(id: number, updateDoctorExpDto: UpdateDoctorExpDto) {
    return `This action updates a #${id} doctorExp`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorExp`;
  }
}
