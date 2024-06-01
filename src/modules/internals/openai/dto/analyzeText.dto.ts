import { ApiProperty } from '@nestjs/swagger';
import { string } from '@hapi/joi';

export default class AnalyzeTextDto {
  @ApiProperty({ type: string, description: 'The text to analyze' })
  text: string;

  @ApiProperty({ type: string, description: 'The question' })
  question?: string;
}
