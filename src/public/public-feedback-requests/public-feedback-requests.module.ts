import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackRequest } from '../../admin/feedback-requests/entities/feedback-request.entity';
import { PublicFeedbackRequestsController } from './public-feedback-requests.controller';
import { PublicFeedbackRequestsService } from './public-feedback-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackRequest])],
  controllers: [PublicFeedbackRequestsController],
  providers: [PublicFeedbackRequestsService],
})
export class PublicFeedbackRequestsModule {}
