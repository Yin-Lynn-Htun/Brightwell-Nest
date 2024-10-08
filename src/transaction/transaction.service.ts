import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientsService } from 'src/patients/patients.service';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly patientService: PatientsService,
  ) {}

  async create(patinetId: number, createTransactionDto: CreateTransactionDto) {
    const { amount, referenceId, type, status, channel } = createTransactionDto;
    const patient = await this.patientService.findOne(patinetId);
    if (!patient) throw new NotFoundException('No patient found!');

    const transaction = this.transactionRepository.create({
      amount: amount,
      referenceId,
      type,
      channel,
      status: status ?? TransactionStatus.SUCCESS,
      patient,
    });

    return await this.transactionRepository.save(transaction);
  }

  async payPendingTransaction(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) throw new NotFoundException('No transaction found!');

    transaction.status = TransactionStatus.SUCCESS;
    return this.transactionRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionRepository.find({
      relations: {
        patient: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.transactionRepository.findOneBy({
      id,
    });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);

    if (!transaction) {
      throw new NotFoundException();
    }

    Object.assign(transaction, updateTransactionDto);

    return await this.transactionRepository.save(transaction);
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async getInpatientTransaction(inpatientId: number) {
    const inpatients = await this.transactionRepository.find({
      where: {
        referenceId: inpatientId,
      },
    });

    return inpatients;
  }
}
