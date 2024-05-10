import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import UserLevel from '../enum/userLevel.enum';

export class UpdateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  full_name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatar_url: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserLevel)
  @IsOptional()
  level: UserLevel;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nationality: string;
}
