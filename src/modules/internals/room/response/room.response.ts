import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoomMemberDto } from '../../roomMember/dto/roomMember.dto';
import { TopicDto } from '@/modules/internals/topic/dto/topic.dto';

export class RoomResponse {
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
  @ApiProperty({ type: TopicDto })
  topic: TopicDto;

  @Expose()
  @ApiProperty({ type: String })
  level: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  is_private: boolean;

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
  @ApiProperty({ type: Number })
  current_member_amount: number;

  @Expose()
  @ApiProperty({ type: String })
  video_sdk_room_id: string;

  @Expose()
  @ApiProperty({ type: Date })
  created_at: Date;

  @Expose()
  @ApiProperty({ type: [RoomMemberDto] })
  room_members: RoomMemberDto[];
}
