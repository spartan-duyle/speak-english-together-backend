import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class LeaveRoomDto {
  @Expose()
  @ApiProperty({ type: String, required: true })
  videoSDKToken: string;
}
