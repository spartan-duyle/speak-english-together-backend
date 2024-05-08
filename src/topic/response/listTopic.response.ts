import { TopicDto } from '../dto/topic.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputResponse } from '../../utils/pagination/paginatedOutputResponse';

export class ListTopicResponse extends PaginatedOutputResponse<TopicDto> {
  @Expose()
  @ApiProperty({ type: [TopicDto] })
  data: TopicDto[];

  @Expose()
  @ApiProperty()
  total: number;
}
