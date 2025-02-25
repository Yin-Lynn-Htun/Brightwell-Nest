import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { SpecialitiesModule } from './specialities/specialities.module';
import { StaffModule } from './staff/staff.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { DoctorEduModule } from './doctor-edu/doctor-edu.module';
import { PackageModule } from './package/package.module';
import { TagModule } from './tag/tag.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ScheduleModule } from './schedule/schedule.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClientAuthService } from './client-auth/client-auth.service';
import { ClientAuthModule } from './client-auth/client-auth.module';
import { ClientAccountModule } from './client-account/client-account.module';
import { PurchaseModule } from './purchase/purchase.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { RoomChargeModule } from './room-charge/room-charge.module';
import { RoomAmenityModule } from './room-amenity/room-amenity.module';
import { RoomModule } from './room/room.module';
import { InpatientModule } from './inpatient/inpatient.module';
import { TransactionModule } from './transaction/transaction.module';
import { InpatientChargeModule } from './inpatient-charge/inpatient-charge.module';
import { SlotModule } from './slot/slot.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { ReportsModule } from './reports/reports.module';
import { SeedService } from './seeders/seed.service';

@Module({
  controllers: [AppController],
  providers: [AppService, ClientAuthService, SeedService],
  imports: [
    NestScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true,
      }),
    }),
    JwtModule.register({
      secret: 'topSecret92', // SECRET KEY - TEXT OR FILE
      signOptions: {
        expiresIn: '24h', // TOKEN EXPIRY TIME
      },
    }),
    PatientsModule,
    SpecialitiesModule,
    StaffModule,
    AuthModule,
    UserModule,
    DoctorModule,
    DoctorEduModule,
    PackageModule,
    TagModule,
    ScheduleModule,
    AppointmentModule,
    ClientAuthModule,
    ClientAccountModule,
    PurchaseModule,
    RoomTypeModule,
    RoomChargeModule,
    RoomAmenityModule,
    RoomModule,
    InpatientModule,
    TransactionModule,
    InpatientChargeModule,
    SlotModule,
    MedicalHistoryModule,
    ReportsModule,
  ],
})
export class AppModule {}
