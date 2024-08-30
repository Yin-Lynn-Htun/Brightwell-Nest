import { Module } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { ClientAccountController } from './client-account.controller';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [PatientsModule],
  controllers: [ClientAccountController],
  providers: [ClientAccountService],
})
export class ClientAccountModule {}
