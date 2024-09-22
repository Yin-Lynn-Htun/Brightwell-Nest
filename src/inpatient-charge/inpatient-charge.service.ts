import { Injectable } from '@nestjs/common';
import { CreateInpatientChargeDto } from './dto/create-inpatient-charge.dto';
import { UpdateInpatientChargeDto } from './dto/update-inpatient-charge.dto';

@Injectable()
export class InpatientChargeService {
  create(createInpatientChargeDto: CreateInpatientChargeDto) {
    return 'This action adds a new inpatientCharge';
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
