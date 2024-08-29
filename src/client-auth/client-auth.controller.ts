import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientAuthService } from './client-auth.service';
import { CreateClientAuthDto } from './dto/create-client-auth.dto';
import { UpdateClientAuthDto } from './dto/update-client-auth.dto';
import { LoginPayload } from './dto/login-client-auth.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './client-jwt.guard';

@Controller('client-auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  @Post('login')
  login(@Body() loginPayload: LoginPayload) {
    return this.clientAuthService.login(loginPayload);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log(req.user);
    return 'status';
  }
}
