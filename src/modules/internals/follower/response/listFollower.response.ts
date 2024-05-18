import { PaginatedOutputResponse } from '@/common/helpers/responses/paginatedOutput.response';
import { Follower } from '@/modules/internals/follower/model/follower';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class ListFollowerResponse extends PaginatedOutputResponse<Follower> {
  @ApiProperty({ type: [Follower] })
  @Expose()
  data: Follower[];

  @Expose()
  @ApiProperty({ type: Number })
  total: number;
}
