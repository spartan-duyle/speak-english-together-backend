import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Follower {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  full_name: string;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  avatar_url: string;

  @ApiProperty({ type: String })
  @Expose()
  level: string;

  @ApiProperty({ type: String })
  @Expose()
  nationality: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  is_following: boolean;

  @ApiProperty({ type: String })
  comet_chat_uid?: string;
}
