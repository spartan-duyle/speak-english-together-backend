import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import UserLevel from '@/common/enum/userLevel.enum';

export class UpdateUserDto {
  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  full_name: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsOptional()
  avatar_url: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserLevel)
  @IsOptional()
  level: UserLevel;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nationality: string;
}
