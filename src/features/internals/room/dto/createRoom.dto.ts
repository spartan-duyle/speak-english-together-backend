import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export default class CreateRoomDto {
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, required: true, nullable: true })
  @IsNumber()
  @IsOptional()
  topicId: number;

  @ApiProperty({ type: Boolean, required: true, nullable: true })
  @IsOptional()
  isPrivate: boolean;

  @ApiProperty({ type: String, required: true, nullable: true })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ type: String, required: true, nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: String, required: true, nullable: true })
  @IsString()
  @IsOptional()
  thumbnail: string;

  @ApiProperty({ type: Number, required: true, nullable: false })
  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  maxMemberAmount: number;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  @IsNotEmpty()
  videoSDKToken: string;
}
