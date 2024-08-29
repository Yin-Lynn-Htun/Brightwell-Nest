import { PatientsService } from './../patients/patients.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientAuthDto } from './dto/create-client-auth.dto';
import { UpdateClientAuthDto } from './dto/update-client-auth.dto';
import { LoginPayload } from './dto/login-client-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { saltOrRounds } from 'src/constants';

@Injectable()
export class ClientAuthService {
  constructor(
    private readonly patientsService: PatientsService,
    private jwtService: JwtService,
  ) {}
  async login({
    email,
    password,
  }: LoginPayload): Promise<{ accessToken: string }> {
    const patient = await this.patientsService.findByEmail(email);

    if (!patient) throw new NotFoundException();

    if (await bcrypt.compare(password, patient.password)) {
      const payload = {
        email,
        id: patient.id,
        phoneNumber: patient.phoneNumber,
        firstName: patient.firstName,
        lastName: patient.lastName,
      };

      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new HttpException('Invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  create(createClientAuthDto: CreateClientAuthDto) {
    return 'This action adds a new clientAuth';
  }

  findAll() {
    return `This action returns all clientAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientAuth`;
  }

  update(id: number, updateClientAuthDto: UpdateClientAuthDto) {
    return `This action updates a #${id} clientAuth`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientAuth`;
  }
}
