import { PaginatedOutputResponse } from '@/common/helpers/responses/paginatedOutput.response';
import { VocabularyTopicDto } from '@/modules/internals/vocabularyTopic/dto/vocabularyTopicDto';
import { ApiProperty } from '@nestjs/swagger';
import VocabularyTopicResponse from '@/modules/internals/vocabularyTopic/response/vocabularyTopic.response';

export default class ListVocabularyTopicResponse extends PaginatedOutputResponse<VocabularyTopicDto> {
  @ApiProperty({ type: [VocabularyTopicResponse] })
  data: VocabularyTopicResponse[];

  @ApiProperty({ type: 'number' })
  total: number;
}