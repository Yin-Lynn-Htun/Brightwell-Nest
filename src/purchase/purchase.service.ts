import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
  async create(patientId: number, purchasePackagesDto: CreatePurchaseDto) {
    const { packages } = purchasePackagesDto;

    const purchasePackages = [];

    const patient = await this.patientService.findOne(patientId);

    if (!patient) throw new NotFoundException('User not found.');

    for (const pkg of packages) {
      const item = await this.packageService.findOne(pkg.packageId);

      if (!item) throw new NotFoundException('Package not found.');

      for (let i = 0; i < pkg.quantity; i++) {
        const userPackage = this.purchaseRepository.create({
          package: item,
          patient: patient,
          status: PurchaseStatus.ACTIVE,
        });

        purchasePackages.push(await this.purchaseRepository.save(userPackage));
      }
    }

    return purchasePackages;
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
