import { PaginatedOutputResponse } from '../../utils/pagination/paginatedOutputResponse';
import { RoomResponse } from './room.response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListRoomResponse extends PaginatedOutputResponse<RoomResponse> {
  @Expose()
  @ApiProperty({ type: [RoomResponse] })
  data: RoomResponse[];

  @Expose()
  @ApiProperty()
  total: number;
}
