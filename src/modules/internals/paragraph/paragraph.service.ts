import { Injectable, NotFoundException } from '@nestjs/common';
import ParagraphCreateDto from '@/modules/internals/paragraph/dto/paragraphCreate.dto';
import ParagraphRepository from '@/modules/internals/paragraph/paragraph.repository';
import ParagraphResponse from '@/modules/internals/paragraph/response/paragraph.response';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import ListParagraphResponse from '@/modules/internals/paragraph/response/listParagraph.response';
import { QuestionLevelEnum } from '@/common/enum/questionLevel.enum';
import { ParagraphUpdateDto } from '@/modules/internals/paragraph/dto/paragraphUpdate.dto';

@Injectable()
export class ParagraphService {
  constructor(
    private readonly paragraphRepository: ParagraphRepository,
  ) {}

  async create(
    userId: number,
    data: ParagraphCreateDto,
  ): Promise<ParagraphResponse> {
    const result = await this.paragraphRepository.insert(
      userId,
      data.name,
      data.original_text,
      data.question,
      data.audio_link,
      data.updated_text,
      data.translated_updated_text,
      data.relevance_to_question,
      data.overall_comment,
      data.topic_name,
      data.level,
      data.suggestion_answers,
      data.suggestion_improvements,
    );

    return plainToInstanceCustom(ParagraphResponse, result);
  }

  async getAllParagraphs(
    userId: number,
    page: number,
    perPage: number,
    search: string,
    topicId: number,
    level: QuestionLevelEnum,
  ): Promise<ListParagraphResponse> {
    const { data, total } = await this.paragraphRepository.getAllParagraphs(
      userId,
      page || 1,
      perPage || 10,
      search,
      topicId,
      level,
    );

    const paragraphs = data.map((paragraph) => {
      return plainToInstanceCustom(ParagraphResponse, paragraph);
    });

    return { data: paragraphs, total };
  }

  async getParagraphById(
    userId: number,
    paragraphId: number,
  ): Promise<ParagraphResponse> {
    const result = await this.paragraphRepository.getParagraphById(
      userId,
      paragraphId,
    );
    if (!result) {
      throw new NotFoundException(ErrorMessages.PARAGRAPH.NOT_FOUND);
    }

    return plainToInstanceCustom(ParagraphResponse, result);
  }

  async updateParagraph(
    userId: number,
    id: number,
    data: ParagraphUpdateDto,
  ): Promise<ParagraphResponse> {
    const paragraph = await this.paragraphRepository.getParagraphById(
      userId,
      id,
    );
    if (!paragraph) {
      throw new NotFoundException(ErrorMessages.PARAGRAPH.NOT_FOUND);
    }
    const result = await this.paragraphRepository.update(userId, id, data.name);

    return plainToInstanceCustom(ParagraphResponse, result);
  }

  async deleteParagraph(
    userId: number,
    paragraphId: number,
  ): Promise<ParagraphResponse> {
    const paragraph = await this.paragraphRepository.getParagraphById(
      userId,
      paragraphId,
    );
    if (!paragraph) {
      throw new NotFoundException(ErrorMessages.PARAGRAPH.NOT_FOUND);
    }

    const result = await this.paragraphRepository.deleteParagraph(
      userId,
      paragraphId,
    );
    return plainToInstanceCustom(ParagraphResponse, result);
  }
}
