import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class VideoSDKTokenResponse {
  @Expose()
  @ApiProperty({ type: String })
  token: string;
}
