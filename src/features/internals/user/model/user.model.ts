import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserLevel } from '../enum/userLevel.enum';
import { Role } from '../enum/role.enum';
import { UserStatus } from '../enum/userStatus.enum';

export class UserModel {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: String })
  email: string;

  @Expose()
  @ApiProperty({ type: String })
  password: string;

  @Expose()
  @ApiProperty({ type: String })
  full_name: string;

  @Expose()
  @ApiProperty({ type: String })
  level: UserLevel = UserLevel.BEGINNER;

  @Expose()
  @ApiProperty({ type: String })
  role: Role = Role.USER;

  @Expose()
  @ApiProperty({ type: String })
  description: string;

  @Expose()
  @ApiProperty({ type: String })
  avatar_url: string;

  @Expose()
  @ApiProperty({ type: String })
  nationality: string;

  @Expose()
  @ApiProperty({ type: String })
  status: UserStatus = UserStatus.UNVERIFIED;

  @Expose()
  @ApiProperty({ type: Date })
  created_at: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updated_at: Date;

  @Expose()
  @ApiProperty({ type: Date })
  deleted_at: Date;
}
