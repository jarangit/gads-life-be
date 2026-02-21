import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { Collection } from '../collection/entities/collection.entity';
import {
  DashboardSummaryDto,
  AnalyticsReportDto,
  TrendDataDto,
  DataTrendDto,
  CategoyAnalyticsDto,
  BrandAnalyticsDto,
  CollectionAnalyticsDto,
  ProductStatusAnalyticsDto,
  DataVolatilityDto,
} from './dto/analytics.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}

  /**
   * Get dashboard summary with quick stats
   */
  async getDashboardSummary(): Promise<DashboardSummaryDto> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProducts,
      totalBrands,
      totalCategories,
      totalCollections,
      productsCreatedThisMonth,
      brandsCreatedThisMonth,
      categoriesCreatedThisMonth,
      collectionsCreatedThisMonth,
    ] = await Promise.all([
      this.productRepository.count(),
      this.brandRepository.count(),
      this.categoryRepository.count(),
      this.collectionRepository.count(),
      this.productRepository.count({
        where: {
          createdAt: Between(firstDayOfMonth, now),
        },
      }),
      this.brandRepository.count({
        where: {
          createdAt: Between(firstDayOfMonth, now),
        },
      }),
      this.categoryRepository.count({
        where: {
          createdAt: Between(firstDayOfMonth, now),
        },
      }),
      this.collectionRepository.count({
        where: {
          createdAt: Between(firstDayOfMonth, now),
        },
      }),
    ]);

    return {
      totalProducts,
      totalBrands,
      totalCategories,
      totalCollections,
      productsCreatedThisMonth,
      brandsCreatedThisMonth,
      categoriesCreatedThisMonth,
      collectionsCreatedThisMonth,
    };
  }

  /**
   * Get product trends for a date range (daily count)
   */
  async getProductTrends(
    startDate: Date,
    endDate: Date,
  ): Promise<DataTrendDto> {
    const products = await this.productRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      select: ['createdAt'],
      order: {
        createdAt: 'ASC',
      },
    });

    return this.aggregateTrendData('Products', products);
  }

  /**
   * Get brand trends for a date range (daily count)
   */
  async getBrandTrends(startDate: Date, endDate: Date): Promise<DataTrendDto> {
    const brands = await this.brandRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      select: ['createdAt'],
      order: {
        createdAt: 'ASC',
      },
    });

    return this.aggregateTrendData('Brands', brands);
  }

  /**
   * Get category trends for a date range (daily count)
   */
  async getCategoryTrends(
    startDate: Date,
    endDate: Date,
  ): Promise<DataTrendDto> {
    const categories = await this.categoryRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      select: ['createdAt'],
      order: {
        createdAt: 'ASC',
      },
    });

    return this.aggregateTrendData('Categories', categories);
  }

  /**
   * Get collection trends for a date range (daily count)
   */
  async getCollectionTrends(
    startDate: Date,
    endDate: Date,
  ): Promise<DataTrendDto> {
    const collections = await this.collectionRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      select: ['createdAt'],
      order: {
        createdAt: 'ASC',
      },
    });

    return this.aggregateTrendData('Collections', collections);
  }

  /**
   * Get top categories by product count
   */
  async getTopCategories(limit: number = 5): Promise<CategoyAnalyticsDto[]> {
    const totalProducts = await this.productRepository.count();

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .loadRelationIds({
        relations: ['products'],
      })
      .getMany();

    const categoryData = categories.map((cat) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      totalProducts: Array.isArray(cat.products)
        ? cat.products.length
        : cat.products
          ? 1
          : 0,
    }));

    return categoryData
      .sort((a, b) => b.totalProducts - a.totalProducts)
      .slice(0, limit)
      .map((item) => ({
        ...item,
        percentageOfTotal:
          totalProducts > 0 ? (item.totalProducts / totalProducts) * 100 : 0,
      }));
  }

  /**
   * Get top brands by product count
   */
  async getTopBrands(limit: number = 5): Promise<BrandAnalyticsDto[]> {
    const totalProducts = await this.productRepository.count();

    const brands = await this.brandRepository
      .createQueryBuilder('brand')
      .loadRelationIds({
        relations: ['products'],
      })
      .getMany();

    const brandData = brands.map((brand) => ({
      brandId: brand.id,
      brandName: brand.name,
      totalProducts: Array.isArray(brand.products)
        ? brand.products.length
        : brand.products
          ? 1
          : 0,
    }));

    return brandData
      .sort((a, b) => b.totalProducts - a.totalProducts)
      .slice(0, limit)
      .map((item) => ({
        ...item,
        percentageOfTotal:
          totalProducts > 0 ? (item.totalProducts / totalProducts) * 100 : 0,
      }));
  }

  /**
   * Get top collections by item count
   */
  async getTopCollections(limit: number = 5): Promise<CollectionAnalyticsDto[]> {
    const collections = await this.collectionRepository
      .createQueryBuilder('collection')
      .loadRelationIds({
        relations: ['collectionItems', 'products'],
      })
      .getMany();

    const totalProducts = await this.productRepository.count();

    const collectionData = collections.map((col) => ({
      collectionId: col.id,
      collectionName: col.name,
      totalItems: Array.isArray(col.collectionItems)
        ? col.collectionItems.length
        : 0,
      totalProducts: Array.isArray(col.products) ? col.products.length : 0,
    }));

    return collectionData
      .sort((a, b) => b.totalProducts - a.totalProducts)
      .slice(0, limit)
      .map((item) => ({
        ...item,
        percentageOfTotal:
          totalProducts > 0 ? (item.totalProducts / totalProducts) * 100 : 0,
      }));
  }

  /**
   * Get products grouped by status
   */
  async getProductsByStatus(): Promise<ProductStatusAnalyticsDto[]> {
    const products = await this.productRepository.find();
    const statusMap = new Map<string, number>();

    products.forEach((product) => {
      const status = product.status || 'unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    const totalProducts = products.length;

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: totalProducts > 0 ? (count / totalProducts) * 100 : 0,
    }));
  }

  /**
   * Calculate data volatility metrics
   */
  async calculateDataVolatility(
    startDate: Date,
    endDate: Date,
  ): Promise<DataVolatilityDto[]> {
    const productTrends = await this.getProductTrends(startDate, endDate);
    const brandTrends = await this.getBrandTrends(startDate, endDate);
    const categoryTrends = await this.getCategoryTrends(startDate, endDate);

    const volatility: DataVolatilityDto[] = [];

    // Product volatility
    const productVolatility = this.calculateStandardDeviation(
      productTrends.data.map((d) => d.count),
    );
    volatility.push({
      metric: 'Product Creation Volatility',
      value: parseFloat(productVolatility.toFixed(2)),
      unit: 'std_dev',
      description: `Standard deviation of daily product creations: ${productVolatility.toFixed(2)}`,
    });

    // Brand volatility
    const brandVolatility = this.calculateStandardDeviation(
      brandTrends.data.map((d) => d.count),
    );
    volatility.push({
      metric: 'Brand Creation Volatility',
      value: parseFloat(brandVolatility.toFixed(2)),
      unit: 'std_dev',
      description: `Standard deviation of daily brand creations: ${brandVolatility.toFixed(2)}`,
    });

    // Category volatility
    const categoryVolatility = this.calculateStandardDeviation(
      categoryTrends.data.map((d) => d.count),
    );
    volatility.push({
      metric: 'Category Creation Volatility',
      value: parseFloat(categoryVolatility.toFixed(2)),
      unit: 'std_dev',
      description: `Standard deviation of daily category creations: ${categoryVolatility.toFixed(2)}`,
    });

    // Growth rate
    const productGrowthRate = this.calculateGrowthRate(
      productTrends.data.map((d) => d.count),
    );
    volatility.push({
      metric: 'Product Growth Rate',
      value: parseFloat(productGrowthRate.toFixed(2)),
      unit: 'percent_change',
      description: `Month-over-month product growth rate: ${productGrowthRate.toFixed(2)}%`,
    });

    return volatility;
  }

  /**
   * Get comprehensive analytics report
   */
  async getAnalyticsReport(
    startDate?: Date,
    endDate?: Date,
  ): Promise<AnalyticsReportDto> {
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // Default last 30 days

    const [summary, productTrends, brandTrends, categoryTrends, collectionTrends, topCategories, topBrands, topCollections, productsByStatus, volatility] =
      await Promise.all([
        this.getDashboardSummary(),
        this.getProductTrends(start, end),
        this.getBrandTrends(start, end),
        this.getCategoryTrends(start, end),
        this.getCollectionTrends(start, end),
        this.getTopCategories(5),
        this.getTopBrands(5),
        this.getTopCollections(5),
        this.getProductsByStatus(),
        this.calculateDataVolatility(start, end),
      ]);

    return {
      generatedAt: new Date(),
      period: {
        startDate: start,
        endDate: end,
      },
      summary: {
        totalProducts: summary.totalProducts,
        totalBrands: summary.totalBrands,
        totalCategories: summary.totalCategories,
        totalCollections: summary.totalCollections,
      },
      trends: {
        products: productTrends,
        brands: brandTrends,
        categories: categoryTrends,
        collections: collectionTrends,
      },
      analysis: {
        topCategories,
        topBrands,
        topCollections,
        productsByStatus,
      },
      dataVolatility: volatility,
    };
  }

  /**
   * Helper: Aggregate data by date
   */
  private aggregateTrendData(
    label: string,
    records: Array<{ createdAt: Date }>,
  ): DataTrendDto {
    const dateMap = new Map<string, number>();

    records.forEach((record) => {
      const dateKey = new Date(record.createdAt)
        .toISOString()
        .split('T')[0];
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    });

    const data: TrendDataDto[] = Array.from(dateMap.entries())
      .map(([dateStr, count]) => ({
        date: new Date(dateStr),
        count,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      label,
      data,
    };
  }

  /**
   * Helper: Calculate standard deviation
   */
  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;

    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Helper: Calculate growth rate
   */
  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;

    const sum = values.reduce((a, b) => a + b, 0);
    if (sum === 0) return 0;

    const firstHalf = values
      .slice(0, Math.ceil(values.length / 2))
      .reduce((a, b) => a + b, 0);
    const secondHalf = values
      .slice(Math.ceil(values.length / 2))
      .reduce((a, b) => a + b, 0);

    return (
      ((secondHalf - firstHalf) / (firstHalf || 1)) * 100
    );
  }
}
