import { Injectable } from '@nestjs/common';
import ParagraphCreateDto from '@/modules/internals/paragraph/dto/paragraphCreate.dto';
import ParagraphRepository from '@/modules/internals/paragraph/paragraph.repository';
import ParagraphResponse from '@/modules/internals/paragraph/response/paragraph.response';

@Injectable()
export class ParagraphService {
  constructor(private readonly paragraphRepository: ParagraphRepository) {}

  async create(
    userId: number,
    data: ParagraphCreateDto,
  ): Promise<ParagraphResponse> {
    return await this.paragraphRepository.insert(
      userId,
      data.original_text,
      data.question,
      data.audio_url,
      data.updated_text,
      data.translated_updated_text,
      data.relevance_to_question,
      data.overall_comment,
    );
  }
}
