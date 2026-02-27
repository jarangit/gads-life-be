import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { FeedbackRequestStatus } from '../entities/feedback-request.entity';

export class UpdateFeedbackRequestDto {
  @IsOptional()
  @IsEnum(FeedbackRequestStatus)
  status?: FeedbackRequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  adminNote?: string;
}
