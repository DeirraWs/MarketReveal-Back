import { Test, TestingModule } from '@nestjs/testing';
import { OffersTrackingController } from '../offers-tracking.controller';

describe('OffersTrackingController', () => {
  let controller: OffersTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersTrackingController],
    }).compile();

    controller = module.get<OffersTrackingController>(OffersTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
