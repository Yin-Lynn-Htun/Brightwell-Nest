import { Module } from '@nestjs/common';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './client-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PatientsModule,
    JwtModule.register({
      secret: 'patient123!',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [ClientAuthController],
  providers: [ClientAuthService, JwtStrategy],
})
export class ClientAuthModule {}
