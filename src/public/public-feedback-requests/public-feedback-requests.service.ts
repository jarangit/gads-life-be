import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublicFeedbackRequestDto } from './dto/create-public-feedback-request.dto';
import {
  FeedbackRequest,
  FeedbackRequestStatus,
} from '../../admin/feedback-requests/entities/feedback-request.entity';

@Injectable()
export class PublicFeedbackRequestsService {
  constructor(
    @InjectRepository(FeedbackRequest)
    private readonly feedbackRequestRepository: Repository<FeedbackRequest>,
  ) {}

  async create(dto: CreatePublicFeedbackRequestDto) {
    const feedbackRequest = this.feedbackRequestRepository.create({
      ...dto,
      status: FeedbackRequestStatus.NEW,
      resolvedAt: null,
      adminNote: null,
    });

    const saved = await this.feedbackRequestRepository.save(feedbackRequest);

    return {
      id: saved.id,
      type: saved.type,
      status: saved.status,
      createdAt: saved.createdAt,
    };
  }
}
