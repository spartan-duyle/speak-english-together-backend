import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CollectionDto {
  @ApiProperty({ type: 'string', description: 'Name of the collection' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ type: 'string', description: 'Description of the collection' })
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({ type: 'string', description: 'Image url of the collection' })
  @IsOptional()
  @Expose()
  image_url?: string;
}
