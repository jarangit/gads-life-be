import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getDashboardSummary: jest.fn(),
    getAnalyticsReport: jest.fn(),
    getProductTrends: jest.fn(),
    getBrandTrends: jest.fn(),
    getCategoryTrends: jest.fn(),
    getCollectionTrends: jest.fn(),
    getTopCategories: jest.fn(),
    getTopBrands: jest.fn(),
    getTopCollections: jest.fn(),
    getProductsByStatus: jest.fn(),
    calculateDataVolatility: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard data', async () => {
      const mockDashboard = {
        totalProducts: 10,
        totalBrands: 5,
        totalCategories: 3,
        totalCollections: 2,
      };

      mockReportsService.getDashboardSummary.mockResolvedValue(mockDashboard);

      const result = await controller.getDashboard();

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
