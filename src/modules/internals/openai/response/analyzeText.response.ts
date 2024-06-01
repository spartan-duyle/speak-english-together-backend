import { ApiProperty } from '@nestjs/swagger';

export default class AnalyzeTextResponse {
  @ApiProperty({ type: String, description: 'The status' })
  status: string;

  @ApiProperty({ type: String, description: 'The overall comment' })
  overall_comment?: string;

  @ApiProperty({ type: String, description: 'The updated text' })
  updated_text?: string;

  @ApiProperty({
    type: String,
    description: 'The translation of updated text',
  })
  translated_updated_text?: string;

  @ApiProperty({ type: [String], description: 'The suggestions' })
  suggestions?: string[];

  @ApiProperty({
    type: String,
    description: 'Is the text relevance to question',
  })
  relevant_to_question?: string;
}
