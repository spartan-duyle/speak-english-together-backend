import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class FollowResponse {
  @Expose()
  @ApiProperty({ type: Boolean, description: 'Is the operation successful?' })
  isSuccessful: boolean;
  constructor(isSuccessful: boolean) {
    this.isSuccessful = isSuccessful;
  }
}