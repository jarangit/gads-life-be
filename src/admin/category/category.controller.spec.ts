import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AdminApiKeyGuard } from '../../common/guards/admin-api-key.guards';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    })
      // Override guard ให้ผ่านเสมอ (ไม่ต้องเช็ค API key จริง)
      .overrideGuard(AdminApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
