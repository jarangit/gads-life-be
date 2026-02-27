import { Body, Controller, Post } from '@nestjs/common';
import { CreatePublicFeedbackRequestDto } from './dto/create-public-feedback-request.dto';
import { PublicFeedbackRequestsService } from './public-feedback-requests.service';

@Controller('public/feedback-requests')
export class PublicFeedbackRequestsController {
  constructor(
    private readonly publicFeedbackRequestsService: PublicFeedbackRequestsService,
  ) {}

  @Post()
  create(@Body() dto: CreatePublicFeedbackRequestDto) {
    return this.publicFeedbackRequestsService.create(dto);
  }
}
