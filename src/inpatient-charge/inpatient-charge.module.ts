import { Module } from '@nestjs/common';
import { InpatientChargeService } from './inpatient-charge.service';
import { InpatientChargeController } from './inpatient-charge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InpatientCharge } from './entities/inpatient-charge.entity';
import { InpatientModule } from 'src/inpatient/inpatient.module';

@Module({
  imports: [TypeOrmModule.forFeature([InpatientCharge]), InpatientModule],
  controllers: [InpatientChargeController],
  providers: [InpatientChargeService],
})
export class InpatientChargeModule {}
