import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class CollectionResponse {
  @ApiProperty({ type: 'number' })
  @Expose()
  id: number;

  @ApiProperty({ type: 'string' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  description?: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  image_url?: string;

  @ApiProperty({ type: 'number' })
  @Expose()
  number_of_vocabularies: number;
}
