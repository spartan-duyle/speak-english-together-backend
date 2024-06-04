import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QuestionLevelEnum } from '@/common/enum/questionLevel.enum';

export default class ParagraphCreateDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  original_text: string;

  @ApiProperty({ type: String })
  @IsOptional()
  question?: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  suggestion_answers?: string[];

  @ApiProperty({ type: String })
  @IsOptional()
  audio_link?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  updated_text?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  translated_updated_text?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  overall_comment?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  relevance_to_question?: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  suggestion_improvements?: string[];

  @ApiProperty({ type: String })
  @IsOptional()
  level?: QuestionLevelEnum;

  @ApiProperty({ type: String })
  @IsOptional()
  topic_name?: string;
}
