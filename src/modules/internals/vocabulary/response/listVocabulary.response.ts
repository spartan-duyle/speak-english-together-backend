import { VocabularyResponse } from '@/modules/internals/vocabulary/response/vocabulary.response';
import { PaginatedOutputResponse } from '@/common/helpers/responses/paginatedOutput.response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListVocabularyResponse extends PaginatedOutputResponse<VocabularyResponse> {
  @Expose()
  @ApiProperty({ type: [VocabularyResponse] })
  data: VocabularyResponse[];

  @Expose()
  @ApiProperty()
  total: number;
}
