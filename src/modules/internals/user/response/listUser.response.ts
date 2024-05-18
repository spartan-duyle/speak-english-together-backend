import { PaginatedOutputResponse } from '@/common/helpers/responses/paginatedOutput.response';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import UserResponse from '@/modules/internals/user/response/userResponse';

export default class ListUserResponse extends PaginatedOutputResponse<UserResponse> {
  @Expose()
  @ApiProperty({ type: [UserResponse] })
  data: UserResponse[];

  @Expose()
  @ApiProperty({ type: Number })
  total: number;
}
