import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslateDto {
  @IsString()
  @ApiProperty({
    description: 'Text to translate',
    required: true,
    nullable: false,
  })
  readonly text: string;

  @IsString()
  @ApiProperty({
    description: 'Language to translate to',
    required: true,
    nullable: false,
  })
  readonly to: string;

  readonly from?: string;
}
