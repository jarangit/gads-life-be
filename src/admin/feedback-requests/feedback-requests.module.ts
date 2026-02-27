import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminApiKeyGuard } from '../../common/guards/admin-api-key.guards';
import { FeedbackRequestsController } from './feedback-requests.controller';
import { FeedbackRequestsService } from './feedback-requests.service';
import { FeedbackRequest } from './entities/feedback-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackRequest])],
  controllers: [FeedbackRequestsController],
  providers: [FeedbackRequestsService, AdminApiKeyGuard],
})
export class FeedbackRequestsModule {}
