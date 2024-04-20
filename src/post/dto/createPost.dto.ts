import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @ApiProperty({
    type: 'string',
    description: 'Title of the post',
    required: true,
    example: 'Post Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
