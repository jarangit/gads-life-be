import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { NotFoundException } from '@nestjs/common';
import { Collection } from '../../admin/collection/entities/collection.entity';
import { PublicCollectionsService } from './public-collections.service';

describe('PublicCollectionsService', () => {
  let service: PublicCollectionsService;

  const mockQb = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockCollectionRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCollectionRepository.createQueryBuilder.mockReturnValue(mockQb);
    mockQb.getManyAndCount.mockResolvedValue([[], 0]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicCollectionsService,
        {
          provide: getRepositoryToken(Collection),
          useValue: mockCollectionRepository,
        },
      ],
    }).compile();

    service = module.get<PublicCollectionsService>(PublicCollectionsService);
  });

  // it('applies published filters and returns paginated data', async () => {
  //   const result = await service.findAll({ page: 1, limit: 20 });

  //   expect(mockQb.where).toHaveBeenCalledWith('collection.status = :status', {
  //     status: 'PUBLISHED',
  //   });
  //   expect(mockQb.andWhere).toHaveBeenCalledWith(
  //     'collection.publishedAt IS NOT NULL',
  //   );
  //   expect(mockQb.andWhere).toHaveBeenCalledWith(
  //     'collection.publishedAt <= :now',
  //     expect.objectContaining({ now: expect.any(Date) }),
  //   );
  //   expect(result.total).toBe(0);
  //   expect(result.totalPages).toBe(0);
  // });

  // it('throws 404 when collection slug is not published', async () => {
  //   mockCollectionRepository.findOne.mockResolvedValue(null);

  //   await expect(service.findOne('draft-collection')).rejects.toBeInstanceOf(
  //     NotFoundException,
  //   );
  // });
});
