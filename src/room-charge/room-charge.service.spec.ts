import { Test, TestingModule } from '@nestjs/testing';
import { RoomChargeService } from './room-charge.service';

describe('RoomChargeService', () => {
  let service: RoomChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomChargeService],
    }).compile();

    service = module.get<RoomChargeService>(RoomChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
