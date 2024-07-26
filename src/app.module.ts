import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { PatientsModule } from './patients/patients.module';

@Module({
  controllers: [AppController, CatsController],
  providers: [AppService],
  imports: [PatientsModule],
})
export class AppModule {}
