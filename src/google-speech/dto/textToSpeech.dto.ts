import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TextToSpeechDto {
  @ApiProperty({ type: String })
  @IsString()
  text: string;
}
