import { PartialType } from '@nestjs/swagger';
import { CreateClientAccountDto } from './create-client-account.dto';

export class UpdateClientAccountDto extends PartialType(CreateClientAccountDto) {}
