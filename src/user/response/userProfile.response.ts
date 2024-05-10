import UserLevel from '../enum/userLevel.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserProfileResponse {
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
}
