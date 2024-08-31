import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { PackageModule } from 'src/package/package.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    PatientsModule,
    PackageModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
