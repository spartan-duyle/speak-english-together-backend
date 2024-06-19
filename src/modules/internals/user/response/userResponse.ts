import UserLevel from '@/common/enum/userLevel.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class UserResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  full_name: string;

  @ApiProperty({ type: String })
  @Expose()
  avatar_url: string;

  @ApiProperty({ type: String })
  @Expose()
  level: UserLevel;

  @ApiProperty({ type: String })
  @Expose()
  nationality: string;

  @ApiProperty({ type: String })
  @Expose()
  description: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  is_following: boolean = true;

  @ApiProperty({ type: Number })
  @Expose()
  followers_count: number;

  @ApiProperty({ type: Number })
  @Expose()
  following_count: number;

  @ApiProperty({ type: Date })
  @Expose()
  birthday: Date;

  @ApiProperty({ type: String })
  @Expose()
  native_language: string;

  @ApiProperty({ type: [String] })
  @Expose()
  interests: string[];

  @ApiProperty({ type: [String] })
  @Expose()
  learning_goals: string;

  @ApiProperty({ type: String })
  @Expose()
  occupation: string;

  @ApiProperty({ type: Date })
  @Expose()
  comet_chat_uid?: string;
}
