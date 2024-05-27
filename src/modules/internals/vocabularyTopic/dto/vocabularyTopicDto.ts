import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class VocabularyTopicDto {
  @ApiProperty({ type: 'string', description: 'Name of the topic' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ type: 'string', description: 'Description of the topic' })
  @IsOptional()
  @Expose()
  description?: string;
}
