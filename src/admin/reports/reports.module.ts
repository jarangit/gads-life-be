import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AnalyticsEvent } from './entities/analytics-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEvent])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
