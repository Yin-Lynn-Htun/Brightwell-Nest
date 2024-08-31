import {
  BadRequestException,
  Injectable,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';
import { PackageService } from 'src/package/package.service';
import { PatientsService } from 'src/patients/patients.service';
import { PurchaseStatus } from 'src/constants';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly packageService: PackageService,
    private readonly patientService: PatientsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  async create(createPurchaseDto: CreatePurchaseDto & { patientId: number }) {
    const { packageId, patientId } = createPurchaseDto;

    console.log(packageId, patientId, 'here');
    const pkg = await this.packageService.findOne(packageId);
    const patient = await this.patientService.findOne(patientId);

    if (!pkg || !patient) throw new BadRequestException();

    const purchase = this.purchaseRepository.create({
      package: pkg,
      patient: patient,
      status: PurchaseStatus.ACTIVE,
    });

    return await this.purchaseRepository.save(purchase);
  }

  findAll() {
    return `This action returns all purchase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
