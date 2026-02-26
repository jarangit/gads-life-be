import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminOnly } from '../../common/decorators/admin-only.decorator';
import { FindFeedbackRequestsDto } from './dto/find-feedback-requests.dto';
import { UpdateFeedbackRequestDto } from './dto/update-feedback-request.dto';
import { FeedbackRequestsService } from './feedback-requests.service';

@Controller('admin/feedback-requests')
@AdminOnly()
export class FeedbackRequestsController {
  constructor(
    private readonly feedbackRequestsService: FeedbackRequestsService,
  ) {}

  @Get()
  findAll(@Query() query: FindFeedbackRequestsDto) {
    return this.feedbackRequestsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackRequestsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeedbackRequestDto) {
    return this.feedbackRequestsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackRequestsService.remove(id);
  }
}
