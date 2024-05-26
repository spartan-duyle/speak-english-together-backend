import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VocabularyTopicDto } from '@/modules/internals/vocabularyTopic/dto/vocabularyTopicDto';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import { VocabularyTopicRepository } from '@/modules/internals/vocabularyTopic/vocabularyTopic.repository';
import ListVocabularyTopicResponse from '@/modules/internals/vocabularyTopic/response/listVocabularyTopic.response';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import { VocabularyRepository } from '@/modules/internals/vocabulary/vocabulary.repository';
import VocabularyTopicResponse from '@/modules/internals/vocabularyTopic/response/vocabularyTopic.response';

@Injectable()
export class VocabularyTopicService {
  constructor(
    private readonly vocabularyTopicRepository: VocabularyTopicRepository,
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async create(
    data: VocabularyTopicDto,
    userId: number,
  ): Promise<VocabularyTopicResponse> {
    const vocabularyTopic =
      await this.vocabularyTopicRepository.findByNameAndUserId(
        data.name,
        userId,
      );

    if (vocabularyTopic) {
      throw new BadRequestException(
        ErrorMessages.VOCABULARY_TOPIC.ALREADY_EXISTS,
      );
    }
    const result = this.vocabularyTopicRepository.insert(data, userId);
    return plainToInstanceCustom(VocabularyTopicResponse, result);
  }

  async getVocabularyTopics(
    userId: number,
    page: number,
    perPage: number,
    search: string,
  ): Promise<ListVocabularyTopicResponse> {
    const { data, total } =
      await this.vocabularyTopicRepository.getVocabularyTopics(
        userId,
        page || 1,
        perPage || 10,
        search,
      );

    const vocabularyTopics = data.map((item) => {
      return plainToInstanceCustom(VocabularyTopicResponse, item);
    });

    return { data: vocabularyTopics, total };
  }

  async update(
    data: VocabularyTopicDto,
    userId: number,
    vocabularyTopicId: number,
  ): Promise<VocabularyTopicResponse> {
    const existingVocabularyTopic = await this.findByIdAndUserId(
      vocabularyTopicId,
      userId,
    );

    const result = await this.vocabularyTopicRepository.update(
      data,
      existingVocabularyTopic.id,
    );

    return plainToInstanceCustom(VocabularyTopicResponse, result);
  }

  async delete(
    userId: number,
    vocabularyTopicId: number,
  ): Promise<VocabularyTopicResponse> {
    const existingVocabularyTopic = await this.findByIdAndUserId(
      vocabularyTopicId,
      userId,
    );

    // Delete all vocabularies of this topic
    await this.vocabularyRepository.batchDeleteByTopicId(
      existingVocabularyTopic.id,
    );

    const result =
      await this.vocabularyTopicRepository.delete(vocabularyTopicId);
    return plainToInstanceCustom(VocabularyTopicResponse, result);
  }

  async findByIdAndUserId(vocabularyTopicId: number, userId: number) {
    const existingVocabularyTopic =
      await this.vocabularyTopicRepository.findByIdAndUserId(
        vocabularyTopicId,
        userId,
      );

    if (!existingVocabularyTopic) {
      throw new NotFoundException(ErrorMessages.VOCABULARY_TOPIC.NOT_FOUND);
    }

    return plainToInstanceCustom(
      VocabularyTopicResponse,
      existingVocabularyTopic,
    );
  }
}
