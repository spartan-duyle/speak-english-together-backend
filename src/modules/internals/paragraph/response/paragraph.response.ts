import { ApiProperty } from '@nestjs/swagger';

export default class ParagraphResponse {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  user_id: number;

  @ApiProperty({ type: String })
  original_text: string;

  @ApiProperty({ type: String })
  question?: string;

  @ApiProperty({ type: String })
  audio_url?: string;

  @ApiProperty({ type: String })
  updated_text?: string;

  @ApiProperty({ type: String })
  translated_updated_text?: string;

  @ApiProperty({ type: String })
  relevance_to_question?: string;

  @ApiProperty({ type: String })
  overall_comment?: string;

  @ApiProperty({ type: Date })
  created_at: Date;
}
