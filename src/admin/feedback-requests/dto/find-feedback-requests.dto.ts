import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import {
  FeedbackRequestStatus,
  FeedbackRequestType,
} from '../entities/feedback-request.entity';

export class FindFeedbackRequestsDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(FeedbackRequestType)
  type?: FeedbackRequestType;

  @IsOptional()
  @IsEnum(FeedbackRequestStatus)
  status?: FeedbackRequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}
