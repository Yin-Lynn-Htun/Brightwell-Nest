import { Module } from '@nestjs/common';
import { InpatientChargeService } from './inpatient-charge.service';
import { InpatientChargeController } from './inpatient-charge.controller';

@Module({
  controllers: [InpatientChargeController],
  providers: [InpatientChargeService],
})
export class InpatientChargeModule {}
