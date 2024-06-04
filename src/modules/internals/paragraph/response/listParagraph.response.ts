import { PaginatedOutputResponse } from '@/common/helpers/responses/paginatedOutput.response';
import ParagraphResponse from '@/modules/internals/paragraph/response/paragraph.response';

export default class ListParagraphResponse extends PaginatedOutputResponse<ParagraphResponse> {
  data: ParagraphResponse[];
  total: number;
}
