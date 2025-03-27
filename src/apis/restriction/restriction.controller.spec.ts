import { Test, TestingModule } from '@nestjs/testing';
import { RestrictionController } from './restriction.controller';
import { RestrictionService } from './restriction.service';

describe('RestrictionController', () => {
  let controller: RestrictionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestrictionController],
      providers: [RestrictionService],
    }).compile();

    controller = module.get<RestrictionController>(RestrictionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
