import { Module } from '@nestjs/common';
import { InpatientChargeService } from './inpatient-charge.service';
import { InpatientChargeController } from './inpatient-charge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InpatientCharge } from './entities/inpatient-charge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InpatientCharge])],
  controllers: [InpatientChargeController],
  providers: [InpatientChargeService],
})
export class InpatientChargeModule {}
