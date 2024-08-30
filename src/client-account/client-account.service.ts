import { Injectable } from '@nestjs/common';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';

@Injectable()
export class ClientAccountService {
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
