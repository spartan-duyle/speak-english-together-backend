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
  fullName: string;

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
  avatarUrl: string;

  @Expose()
  @ApiProperty({ type: String })
  nationality: string;

  @Expose()
  @ApiProperty({ type: String })
  status: UserStatus = UserStatus.UNVERIFIED;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  deletedAt: Date;
}
