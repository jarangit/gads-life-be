import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DateRangeDto } from './dto/date-range.dto';

@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /admin/reports/dashboard
   * Quick dashboard summary with key metrics
   */
  @Get('dashboard')
  async getDashboard() {
    return {
      success: true,
      data: await this.reportsService.getDashboardSummary(),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/analytics?startDate=2024-01-01&endDate=2024-02-01
   * Comprehensive analytics report
   */
  @Get('analytics')
  async getAnalyticsReport(@Query() query: DateRangeDto) {
    return {
      success: true,
      data: await this.reportsService.getAnalyticsReport(
        query.startDate,
        query.endDate,
      ),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/trends/products?startDate=2024-01-01&endDate=2024-02-01
   * Product creation trends over time
   */
  @Get('trends/products')
  async getProductTrends(@Query() query: DateRangeDto) {
    const end = query.endDate || new Date();
    const start =
      query.startDate ||
      new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      success: true,
      data: await this.reportsService.getProductTrends(start, end),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/trends/brands?startDate=2024-01-01&endDate=2024-02-01
   * Brand creation trends over time
   */
  @Get('trends/brands')
  async getBrandTrends(@Query() query: DateRangeDto) {
    const end = query.endDate || new Date();
    const start =
      query.startDate ||
      new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      success: true,
      data: await this.reportsService.getBrandTrends(start, end),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/trends/categories?startDate=2024-01-01&endDate=2024-02-01
   * Category creation trends over time
   */
  @Get('trends/categories')
  async getCategoryTrends(@Query() query: DateRangeDto) {
    const end = query.endDate || new Date();
    const start =
      query.startDate ||
      new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      success: true,
      data: await this.reportsService.getCategoryTrends(start, end),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/trends/collections?startDate=2024-01-01&endDate=2024-02-01
   * Collection creation trends over time
   */
  @Get('trends/collections')
  async getCollectionTrends(@Query() query: DateRangeDto) {
    const end = query.endDate || new Date();
    const start =
      query.startDate ||
      new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      success: true,
      data: await this.reportsService.getCollectionTrends(start, end),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/analytics/categories
   * Top categories by product count
   */
  @Get('analytics/categories')
  async getTopCategories(@Query('limit') limit: number = 5) {
    return {
      success: true,
      data: await this.reportsService.getTopCategories(limit),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/analytics/brands
   * Top brands by product count
   */
  @Get('analytics/brands')
  async getTopBrands(@Query('limit') limit: number = 5) {
    return {
      success: true,
      data: await this.reportsService.getTopBrands(limit),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/analytics/collections
   * Top collections by item and product count
   */
  @Get('analytics/collections')
  async getTopCollections(@Query('limit') limit: number = 5) {
    return {
      success: true,
      data: await this.reportsService.getTopCollections(limit),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/analytics/products-by-status
   * Products grouped by status with percentages
   */
  @Get('analytics/products-by-status')
  async getProductsByStatus() {
    return {
      success: true,
      data: await this.reportsService.getProductsByStatus(),
      timestamp: new Date(),
    };
  }

  /**
   * GET /admin/reports/volatility?startDate=2024-01-01&endDate=2024-02-01
   * Data volatility and growth metrics
   */
  @Get('volatility')
  async getDataVolatility(@Query() query: DateRangeDto) {
    const end = query.endDate || new Date();
    const start =
      query.startDate ||
      new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      success: true,
      data: await this.reportsService.calculateDataVolatility(start, end),
      timestamp: new Date(),
    };
  }
}
