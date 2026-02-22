import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  AnalyticsEvent,
  AnalyticsEventType,
} from './entities/analytics-event.entity';
import { ReportRangeDto, TopListQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly analyticsRepository: Repository<AnalyticsEvent>,
  ) {}

  async getOverview(query: ReportRangeDto) {
    const { from, to } = this.resolveDateRange(query);

    const totalEvents = await this.analyticsRepository.count({
      where: { createdAt: Between(from, to) },
    });

    const pageViews = await this.analyticsRepository.count({
      where: {
        createdAt: Between(from, to),
        eventType: AnalyticsEventType.PAGE_VIEW,
      },
    });

    const productViews = await this.analyticsRepository.count({
      where: {
        createdAt: Between(from, to),
        eventType: AnalyticsEventType.PRODUCT_VIEW,
      },
    });

    const uniqueVisitors = await this.analyticsRepository
      .createQueryBuilder('event')
      .select(
        'COUNT(DISTINCT COALESCE(event.visitorId, event.ipHash))',
        'count',
      )
      .where('event.createdAt BETWEEN :from AND :to', { from, to })
      .getRawOne<{ count: string }>();

    const daily = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('DATE(event.createdAt)', 'date')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        "SUM(CASE WHEN event.eventType = 'page_view' THEN 1 ELSE 0 END)",
        'pageViews',
      )
      .addSelect(
        "SUM(CASE WHEN event.eventType = 'product_view' THEN 1 ELSE 0 END)",
        'productViews',
      )
      .addSelect(
        'COUNT(DISTINCT COALESCE(event.visitorId, event.ipHash))',
        'uniqueVisitors',
      )
      .where('event.createdAt BETWEEN :from AND :to', { from, to })
      .groupBy('DATE(event.createdAt)')
      .orderBy('DATE(event.createdAt)', 'ASC')
      .getRawMany();

    return {
      range: { from, to },
      summary: {
        totalEvents,
        pageViews,
        productViews,
        uniqueVisitors: Number(uniqueVisitors?.count ?? 0),
      },
      daily,
    };
  }

  async getTopProducts(query: TopListQueryDto) {
    const { from, to } = this.resolveDateRange(query);
    const limit = query.limit ?? 10;

    const items = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.productId', 'productId')
      .addSelect('event.productSlug', 'productSlug')
      .addSelect('COUNT(*)', 'views')
      .where('event.createdAt BETWEEN :from AND :to', { from, to })
      .andWhere('event.eventType = :type', {
        type: AnalyticsEventType.PRODUCT_VIEW,
      })
      .andWhere('event.productId IS NOT NULL')
      .groupBy('event.productId')
      .addGroupBy('event.productSlug')
      .orderBy('views', 'DESC')
      .limit(limit)
      .getRawMany();

    return { range: { from, to }, items };
  }

  async getTopPages(query: TopListQueryDto) {
    const { from, to } = this.resolveDateRange(query);
    const limit = query.limit ?? 10;

    const items = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.path', 'path')
      .addSelect('COUNT(*)', 'views')
      .where('event.createdAt BETWEEN :from AND :to', { from, to })
      .andWhere('event.eventType = :type', {
        type: AnalyticsEventType.PAGE_VIEW,
      })
      .andWhere('event.path IS NOT NULL')
      .groupBy('event.path')
      .orderBy('views', 'DESC')
      .limit(limit)
      .getRawMany();

    return { range: { from, to }, items };
  }

  private resolveDateRange(query: ReportRangeDto) {
    const now = new Date();
    const to = query.to ? new Date(`${query.to}T23:59:59.999Z`) : now;
    const from = query.from
      ? new Date(`${query.from}T00:00:00.000Z`)
      : new Date(new Date(to).setDate(to.getDate() - 29));

    return { from, to };
  }
}
