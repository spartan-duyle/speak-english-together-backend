import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostModel {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: String })
  title: string;

  @Expose()
  @ApiProperty({ type: String })
  content: string;
}
