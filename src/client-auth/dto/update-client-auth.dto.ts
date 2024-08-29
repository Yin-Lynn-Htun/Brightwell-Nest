import { PartialType } from '@nestjs/swagger';
import { CreateClientAuthDto } from './create-client-auth.dto';

export class UpdateClientAuthDto extends PartialType(CreateClientAuthDto) {}
