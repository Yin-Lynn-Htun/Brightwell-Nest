import { Injectable } from '@nestjs/common';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientAccountService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRespository: Repository<Patient>,
  ) {}

  async getAppointment(id: number) {
    return await this.patientsRespository.findOne({
      where: {
        id,
      },
      relations: ['appointments'],
    });
  }

  create(createClientAccountDto: CreateClientAccountDto) {
    return 'This action adds a new clientAccount';
  }

  findAll() {
    return `This action returns all clientAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientAccount`;
  }

  update(id: number, updateClientAccountDto: UpdateClientAccountDto) {
    return `This action updates a #${id} clientAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientAccount`;
  }
}
