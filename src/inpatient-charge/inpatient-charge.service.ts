import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateInpatientChargeDto } from './dto/create-inpatient-charge.dto';
import { UpdateInpatientChargeDto } from './dto/update-inpatient-charge.dto';
import { InpatientCharge } from './entities/inpatient-charge.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InpatientService } from 'src/inpatient/inpatient.service';
import { CreateAdditionalChargeDto } from './dto/create-additional-charge.dto';

@Injectable()
export class InpatientChargeService {
  constructor(
    @InjectRepository(InpatientCharge)
    private inpatientChargeRepository: Repository<InpatientCharge>,
    private inpatientRepository: InpatientService,
  ) {}

  async create(createInpatientChargeDto: CreateInpatientChargeDto) {
    const { amount, description, inpatientId } = createInpatientChargeDto;

    const inpatient = await this.inpatientRepository.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found!');

    const inpatientCharge = this.inpatientChargeRepository.create({
      amount,
      description,
      inpatient,
    });
    return await this.inpatientChargeRepository.save(inpatientCharge);
  }

  async hasChargeForToday(inpatientId: number): Promise<boolean> {
    const today = new Date();

    const record = await this.inpatientChargeRepository
      .createQueryBuilder('inpatientCharge')
      .where('DATE(inpatientCharge.createdAt) = :today', {
        today: today.toISOString().split('T')[0],
      })
      .andWhere('inpatientCharge.inpatientId = :inpatientId', { inpatientId })
      .getOne();

    return !!record; // returns true if a record exists for the given inpatient today
  }

  async addRoomCharges(inpatientId: number) {
    const inpatient = await this.inpatientRepository.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found!');

    if (await this.hasChargeForToday(inpatientId))
      throw new NotFoundException('You have already charged for today!');

    const roomCharges = inpatient.roomType.charges ?? [];

    for (const charge of roomCharges) {
      await this.create({
        amount: charge.price,
        description: charge.name,
        inpatientId: inpatient.id,
      });
    }
  }

  async addAdditionalCharges(
    inpatientId: number,
    createAdditionalChargeDto: CreateAdditionalChargeDto,
  ) {
    const {
      charges: { amount, description },
    } = createAdditionalChargeDto;
    const inpatient = await this.inpatientRepository.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found!');

    return await this.create({
      amount,
      description,
      inpatientId,
    });
  }

  findAll() {
    return `This action returns all inpatientCharge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inpatientCharge`;
  }

  update(id: number, updateInpatientChargeDto: UpdateInpatientChargeDto) {
    return `This action updates a #${id} inpatientCharge`;
  }

  remove(id: number) {
    return `This action removes a #${id} inpatientCharge`;
  }
}
