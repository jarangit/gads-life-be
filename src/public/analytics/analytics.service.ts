import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { AnalyticsEvent } from '../../admin/reports/entities/analytics-event.entity';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly analyticsRepository: Repository<AnalyticsEvent>,
  ) {}

  async track(
    dto: TrackEventDto,
    context: { ip?: string; userAgent?: string },
  ) {
    const ipHash = context.ip
      ? createHash('sha256').update(context.ip).digest('hex')
      : null;

    const event = this.analyticsRepository.create({
      eventType: dto.eventType,
      path: dto.path ?? null,
      referrer: dto.referrer ?? null,
      productId: dto.productId ?? null,
      productSlug: dto.productSlug ?? null,
      visitorId: dto.visitorId ?? null,
      ipHash,
      userAgent: context.userAgent ?? null,
    });

    await this.analyticsRepository.save(event);

    return { ok: true };
  }
}
