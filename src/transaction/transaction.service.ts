import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Inpatient } from 'src/inpatient/entities/inpatient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly patientService: PatientsService,
  ) {}

  async create(patinetId: number, createTransactionDto: CreateTransactionDto) {
    const { amount, referenceId, type } = createTransactionDto;
    const patient = await this.patientService.findOne(patinetId);
    if (!patient) throw new NotFoundException('No patient found!');

    const transaction = this.transactionRepository.create({
      amount: amount,
      referenceId,
      type,
      status: TransactionStatus.SUCCESS,
    });

    return await this.transactionRepository.save(transaction);
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
