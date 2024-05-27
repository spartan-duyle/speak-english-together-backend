import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class VocabularyTopicResponse {
  @ApiProperty({ type: 'number' })
  @Expose()
  id: number;

  @ApiProperty({ type: 'string' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  description?: string;
}