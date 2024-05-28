import { PaginatedOutputResponse } from '@/common/helpers/responses/paginatedOutput.response';
import { CollectionDto } from '@/modules/internals/collection/dto/collection.dto';
import { ApiProperty } from '@nestjs/swagger';
import CollectionResponse from '@/modules/internals/collection/response/collection.response';

export default class ListCollectionResponse extends PaginatedOutputResponse<CollectionDto> {
  @ApiProperty({ type: [CollectionResponse] })
  data: CollectionResponse[];

  @ApiProperty({ type: 'number' })
  total: number;
}