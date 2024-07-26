import { Controller, Get, HostParam } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ host: ':account.yinlynnhtun.com' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('admin')
  test(@HostParam('account') account: string) {
    return `abc ${account} sdf`;
  }
}
