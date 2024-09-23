import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { Repository } from 'typeorm';
import { InpatientService } from 'src/inpatient/inpatient.service';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @Inject(forwardRef(() => InpatientService))
    private readonly inpatientService: InpatientService,
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

  findAll() {
    return `This action returns all deposit`;
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
