import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TopicDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: String })
  @Expose()
  image: string;

  @ApiProperty({ type: String })
  @Expose()
  content: string;
}
