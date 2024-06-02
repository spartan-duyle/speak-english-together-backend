import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class ParagraphCreateDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  original_text: string;
  question?: string;
  audio_url?: string;
  updated_text?: string;
  translated_updated_text?: string;
  overall_comment?: string;
  relevance_to_question?: string;
}