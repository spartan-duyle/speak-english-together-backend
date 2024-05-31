import { ApiProperty } from '@nestjs/swagger';

export class GenerateSpeakingQuestionResponse {
  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: String })
  question?: string;

  @ApiProperty({ type: [String] })
  suggestions?: string[];
}
