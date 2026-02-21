import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportRangeDto, TopListQueryDto } from './dto/report-query.dto';

@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  getOverview(@Query() query: ReportRangeDto) {
    return this.reportsService.getOverview(query);
  }

  @Get('top-products')
  getTopProducts(@Query() query: TopListQueryDto) {
    return this.reportsService.getTopProducts(query);
  }

  @Get('top-pages')
  getTopPages(@Query() query: TopListQueryDto) {
    return this.reportsService.getTopPages(query);
  }
}
