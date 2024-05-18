import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponse {
  @ApiProperty({ description: 'URL of the uploaded image' })
  imageUrl: string;
}
