import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class JoinRoomDto {
  @Expose()
  @ApiProperty({ type: String, required: true })
  videoSDKToken: string;

  @Expose()
  @ApiProperty({ type: String, required: false })
  password: string = null;
}
