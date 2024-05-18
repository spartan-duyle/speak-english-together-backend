import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class UnFollowResponse {
  @Expose()
  @ApiProperty({
    type: Boolean,
    description: 'Is unfollow operation successfully',
  })
  isSuccessful: boolean;
  constructor(isSuccessful: boolean) {
    this.isSuccessful = isSuccessful;
  }
}