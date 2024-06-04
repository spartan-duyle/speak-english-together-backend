import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ParagraphUpdateDto {
  @ApiProperty()
  @IsString()
  name: string;
}