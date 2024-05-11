import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ type: String, nullable: false, required: true})
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, nullable: true, required: false})
  @Expose()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ type: String, nullable: true, required: false})
  @Expose()
  @IsString()
  @IsOptional()
  content: string;
}
