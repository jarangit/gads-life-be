import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  buildPaginationOptions,
  buildPaginationResult,
  PaginationResult,
} from '../../common/dto/pagination-query.dto';
import { FindFeedbackRequestsDto } from './dto/find-feedback-requests.dto';
import { UpdateFeedbackRequestDto } from './dto/update-feedback-request.dto';
import {
  FeedbackRequest,
  FeedbackRequestStatus,
} from './entities/feedback-request.entity';

@Injectable()
export class FeedbackRequestsService {
  constructor(
    @InjectRepository(FeedbackRequest)
    private readonly feedbackRequestRepository: Repository<FeedbackRequest>,
  ) {}

  async findAll(
    query: FindFeedbackRequestsDto,
  ): Promise<PaginationResult<FeedbackRequest>> {
    const { page, limit, skip } = buildPaginationOptions(query);

    const qb = this.feedbackRequestRepository
      .createQueryBuilder('feedback')
      .orderBy('feedback.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.type) {
      qb.andWhere('feedback.type = :type', { type: query.type });
    }

    if (query.status) {
      qb.andWhere('feedback.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        '(feedback.name LIKE :search OR feedback.email LIKE :search OR feedback.subject LIKE :search OR feedback.message LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();

    return buildPaginationResult({
      items,
      total,
      page,
      limit,
    });
  }

  async findOne(id: string): Promise<FeedbackRequest> {
    const feedback = await this.feedbackRequestRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback request not found');
    }

    return feedback;
  }

  async update(id: string, dto: UpdateFeedbackRequestDto) {
    const feedback = await this.findOne(id);

    const nextStatus = dto.status ?? feedback.status;
    const shouldSetResolvedAt =
      nextStatus === FeedbackRequestStatus.RESOLVED ||
      nextStatus === FeedbackRequestStatus.CLOSED;

    await this.feedbackRequestRepository.update(id, {
      ...dto,
      resolvedAt: shouldSetResolvedAt ? feedback.resolvedAt ?? new Date() : null,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.feedbackRequestRepository.delete(id);
    return { success: true };
  }
}
