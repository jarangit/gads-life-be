import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PublicCategoriesService } from './public-categories.service';
import { Category } from '../../admin/category/entities/category.entity';

describe('PublicCategoriesService', () => {
  let service: PublicCategoriesService;

  const mockCategoryRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicCategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<PublicCategoriesService>(PublicCategoriesService);
  });

  it('returns only active categories with pagination', async () => {
    mockCategoryRepository.findAndCount.mockResolvedValue([
      [
        {
          id: 'c1',
          slug: 'phones',
          nameTh: 'โทรศัพท์',
          nameEn: 'Phones',
          description: null,
          heroImage: null,
          isActive: true,
          orderIndex: 1,
          createdAt: new Date('2026-02-12T00:00:00.000Z'),
          updatedAt: new Date('2026-02-13T00:00:00.000Z'),
        },
      ],
      1,
    ]);

    const result = await service.findAll({ page: 1, limit: 20 });

    expect(mockCategoryRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true },
        skip: 0,
        take: 20,
      }),
    );
    expect(result.totalPages).toBe(1);
    expect(result.items[0].isActive).toBe(true);
  });

  it('throws 404 when category slug is not active or missing', async () => {
    mockCategoryRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing-slug')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
