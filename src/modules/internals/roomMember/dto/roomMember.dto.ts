import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RoomMemberDto {
  @Expose()
  @ApiProperty({ type: Number })
  user_id: number;

  @Expose()
  @ApiProperty({ type: Number })
  room_id: number;

  @Expose()
  @ApiProperty({ type: Boolean })
  is_host: boolean = false;

  @Expose()
  @ApiProperty({ type: Boolean })
  avatar_url: string;

  @Expose()
  @ApiProperty({ type: String })
  full_name: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  is_muted: boolean = true;
}
