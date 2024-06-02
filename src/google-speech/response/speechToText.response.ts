import { ApiProperty } from '@nestjs/swagger';

export default class SpeechToTextResponse {
  @ApiProperty({ type: String, description: 'The transcript of speech' })
  transcription?: string;

  @ApiProperty({ type: String, description: 'The audio URL' })
  audioUrl?: string;
}
