import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientsService } from 'src/patients/patients.service';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './entities/transaction.entity';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly patientService: PatientsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { amount, referenceId, type, status, channel, patientId } =
      createTransactionDto;
    const patient = await this.patientService.findOne(patientId);
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

  async findAll(limit?: number) {
    console.log(limit, 'limit');
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.patient', 'patient')
      .orderBy('transaction.createdAt', 'DESC');

    if (limit) {
      queryBuilder.take(limit);
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number) {
    return await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        patient: true,
      },
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
      where: [
        { referenceId: inpatientId, type: TransactionType.INPATIENT },
        { referenceId: inpatientId, type: TransactionType.ROOM_DEPOSIT },
      ],
    });

    return inpatients;
  }
}
