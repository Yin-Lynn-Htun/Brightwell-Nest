import {
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit, DepositStatus } from './entities/deposit.entity';
import { Repository } from 'typeorm';
import { InpatientService } from 'src/inpatient/inpatient.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionType } from 'src/transaction/entities/transaction.entity';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @Inject(forwardRef(() => InpatientService))
    private readonly inpatientService: InpatientService,
    private readonly transactionService: TransactionService,
  ) {}

  async create(createDepositDto: CreateDepositDto) {
    const { amount, inpatientId } = createDepositDto;

    const inpatient = await this.inpatientService.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found.');

    const deposit = this.depositRepository.create({
      amount,
      inpatient,
    });

    this.depositRepository.save(deposit);
  }

  async payDeposit(patientId: number, depositId: number) {
    const deposit = await this.findOne(depositId);
    if (!deposit) throw new NotFoundException('Deposit not found!');

    const transaction = await this.transactionService.create(patientId, {
      amount: deposit.amount,
      type: TransactionType.DEPOSIT,
      referenceId: deposit.id,
    });

    deposit.status = DepositStatus.SUCCESS;
    return await this.depositRepository.save(deposit);
  }

  async findAll() {
    return await this.depositRepository.find();
  }

  async findOne(id: number) {
    return await this.depositRepository.findOneBy({
      id,
    });
  }

  async update(id: number, updateDepositDto: UpdateDepositDto) {
    const deposit = await this.findOne(id);
    if (!deposit) throw new NotFoundException('Deposit not found!');

    Object.assign(deposit, updateDepositDto);
    return await this.depositRepository.save(deposit);
  }

  remove(id: number) {
    return `This action removes a #${id} deposit`;
  }
}
