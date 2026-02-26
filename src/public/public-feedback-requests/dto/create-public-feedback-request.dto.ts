import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FeedbackRequestType } from '../../../admin/feedback-requests/entities/feedback-request.entity';

export class CreatePublicFeedbackRequestDto {
  @IsEnum(FeedbackRequestType)
  type: FeedbackRequestType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  pageUrl?: string;
}
