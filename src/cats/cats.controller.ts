import { Controller, Get, Param, Query, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
