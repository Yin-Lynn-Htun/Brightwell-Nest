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

  async addRoomCharges(inpatientId: number) {
    const inpatient = await this.inpatientRepository.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found!');

    const roomCharges = inpatient.roomType.charges;

    for (const charge of roomCharges) {
      await this.create({
        amount: charge.price,
        description: charge.name,
        inpatientId: inpatient.id,
      });
    }
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
