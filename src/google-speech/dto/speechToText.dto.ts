import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SpeechToTextDto {
  @ApiProperty({ type: String })
  @IsString()
  audioUrlPath: string;
}
