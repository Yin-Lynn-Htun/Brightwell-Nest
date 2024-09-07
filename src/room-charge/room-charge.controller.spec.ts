import { Test, TestingModule } from '@nestjs/testing';
import { RoomChargeController } from './room-charge.controller';
import { RoomChargeService } from './room-charge.service';

describe('RoomChargeController', () => {
  let controller: RoomChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomChargeController],
      providers: [RoomChargeService],
    }).compile();

    controller = module.get<RoomChargeController>(RoomChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
