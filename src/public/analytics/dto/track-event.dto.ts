import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AnalyticsEventType } from '../../../admin/reports/entities/analytics-event.entity';

export class TrackEventDto {
  @IsEnum(AnalyticsEventType)
  eventType: AnalyticsEventType;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  referrer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  productId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  productSlug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  visitorId?: string;
}
