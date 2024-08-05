import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authcredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authcredentialsDto;
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phoneNumber',
        'password',
      ],
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // PREVIOUSLY HERE ONLY successful message
      // JWT TOKEN FOR SECURE
      const payload: JwtPayload = {
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: 'Admin',
      };
      console.log(payload);
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials.');
    }
  }
}
