import { Test, TestingModule } from '@nestjs/testing';
import { SearchManageController } from '../search-manage.controller';

describe('SearchManageController', () => {
  let controller: SearchManageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchManageController],
    }).compile();

    controller = module.get<SearchManageController>(SearchManageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
