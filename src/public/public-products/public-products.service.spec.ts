import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PublicProductsService } from './public-products.service';
import { Product } from '../../admin/products/entities/product.entity';
import { ProductStatus } from '../../admin/products/dto/validate.dto';

describe('PublicProductsService', () => {
  let service: PublicProductsService;

  const mockProductRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<PublicProductsService>(PublicProductsService);
  });

  it('filters list to published products and returns pagination metadata', async () => {
    mockProductRepository.findAndCount.mockResolvedValue([
      [
        {
          id: 'p1',
          name: 'Product 1',
          subtitle: 'Subtitle',
          image: null,
          overallScore: 4.5,
          isRecommended: true,
          price: 100,
          currency: 'THB',
          priceLabel: '100 THB',
          affiliateLink: null,
          lastUpdated: '2026-02-13',
          status: ProductStatus.PUBLISHED,
          categoryId: null,
          brandId: null,
          category: null,
          brand: null,
          ratings: [],
          createdAt: new Date('2026-02-12T00:00:00.000Z'),
          updatedAt: new Date('2026-02-13T00:00:00.000Z'),
        },
      ],
      1,
    ]);

    const result = await service.findAll({ page: 1, limit: 20 });

    expect(mockProductRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: ProductStatus.PUBLISHED }),
        skip: 0,
        take: 20,
      }),
    );
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.items[0].status).toBe(ProductStatus.PUBLISHED);
  });

  it('throws 404 when product is not published or not found', async () => {
    mockProductRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('draft-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(mockProductRepository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'draft-id', status: ProductStatus.PUBLISHED },
      }),
    );
  });
});
