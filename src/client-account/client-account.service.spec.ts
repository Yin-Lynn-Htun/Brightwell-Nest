import { Test, TestingModule } from '@nestjs/testing';
import { ClientAccountService } from './client-account.service';

describe('ClientAccountService', () => {
  let service: ClientAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientAccountService],
    }).compile();

    service = module.get<ClientAccountService>(ClientAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
