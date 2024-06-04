import { ApiProperty } from '@nestjs/swagger';
import { TopicDto } from '@/modules/internals/topic/dto/topic.dto';
import { QuestionLevelEnum } from '@/common/enum/questionLevel.enum';
import { Expose } from 'class-transformer';

export default class ParagraphResponse {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Number })
  @Expose()
  user_id: number;

  @ApiProperty({ type: String })
  @Expose()
  original_text: string;

  @ApiProperty({ type: String })
  @Expose()
  question?: string;

  @ApiProperty({ type: [String] })
  @Expose()
  suggestion_answers?: string[];

  @ApiProperty({ type: String })
  @Expose()
  audio_url?: string;

  @ApiProperty({ type: String })
  @Expose()
  updated_text?: string;

  @ApiProperty({ type: String })
  @Expose()
  translated_updated_text?: string;

  @ApiProperty({ type: String })
  @Expose()
  relevance_to_question?: string;

  @ApiProperty({ type: String })
  @Expose()
  overall_comment?: string;

  @ApiProperty({ type: String })
  @Expose()
  topic_name?: string;

  @ApiProperty({ type: String })
  @Expose()
  level?: QuestionLevelEnum;

  @ApiProperty({ type: [String] })
  @Expose()
  suggestion_improvements?: string[];

  @ApiProperty({ type: Date })
  @Expose()
  created_at: Date;
}
