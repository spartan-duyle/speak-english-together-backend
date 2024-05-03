import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class CreateRoomResponse {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: String })
  name: string;

  @Expose()
  @ApiProperty({ type: Number })
  host_user_id: number;

  @Expose()
  @ApiProperty({ type: Number })
  topic_id: number;

  @Expose()
  @ApiProperty({ type: Boolean })
  is_private: boolean;

  @Expose()
  @ApiProperty({ type: String })
  password: string;

  @Expose()
  @ApiProperty({ type: String })
  description: string;

  @Expose()
  @ApiProperty({ type: String })
  thumbnail: string;

  @Expose()
  @ApiProperty({ type: Number })
  max_member_amount: number;

  @Expose()
  @ApiProperty({ type: String })
  video_sdk_room_id: string;

  @Expose()
  @ApiProperty({ type: Date })
  created_at: Date;
}
