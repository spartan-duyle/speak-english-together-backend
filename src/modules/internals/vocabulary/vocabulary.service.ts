import { Injectable, NotFoundException } from '@nestjs/common';
import { VocabularyRepository } from '@/modules/internals/vocabulary/vocabulary.repository';
import { AddUpdateVocabularyDto } from '@/modules/internals/vocabulary/dto/addUpdateVocabularyDto';
import { VocabularyResponse } from '@/modules/internals/vocabulary/response/vocabulary.response';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import { ExampleSentenceDto } from '@/modules/internals/vocabulary/dto/exampleSentence.dto';
import { ListVocabularyResponse } from '@/modules/internals/vocabulary/response/listVocabulary.response';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';

@Injectable()
export class VocabularyService {
  constructor(private readonly vocabularyRepository: VocabularyRepository) {}

  async create(
    data: AddUpdateVocabularyDto,
    userId: number,
  ): Promise<VocabularyResponse> {
    const result = await this.vocabularyRepository.create(data, userId);
    const vocabularyResponse = plainToInstanceCustom(
      VocabularyResponse,
      result,
    );
    vocabularyResponse.examples = result.examples.map((item) => {
      return plainToInstanceCustom(ExampleSentenceDto, item);
    });

    return vocabularyResponse;
  }

  async getVocabularies(
    userId: number,
    page: number,
    perPage: number,
    search: string,
  ): Promise<ListVocabularyResponse> {
    const { data, total } = await this.vocabularyRepository.getVocabularies(
      userId,
      page || 1,
      perPage || 10,
      search,
    );

    const vocabularies = data.map((item) => {
      const vocabularyResponse = plainToInstanceCustom(
        VocabularyResponse,
        item,
      );
      vocabularyResponse.examples = item.examples.map((example) => {
        return plainToInstanceCustom(ExampleSentenceDto, example);
      });

      return vocabularyResponse;
    });

    return {
      data: vocabularies,
      total,
    };
  }

  async getVocabulary(id: number) {
    const data = await this.vocabularyRepository.findById(id);
    if (!data) {
      throw new NotFoundException('Vocabulary not found');
    }
    const vocabularyResponse = plainToInstanceCustom(VocabularyResponse, data);
    vocabularyResponse.examples = data.examples.map((item) => {
      return plainToInstanceCustom(ExampleSentenceDto, item);
    });
    return vocabularyResponse;
  }

  async deleteVocabulary(id: number) {
    const data = await this.vocabularyRepository.findById(id);

    if (!data) {
      throw new NotFoundException(ErrorMessages.VOCABULARY.NOT_FOUND);
    }

    await this.vocabularyRepository.delete(id);
  }

  async updateVocabulary(id: number, data: AddUpdateVocabularyDto) {
    const vocabulary = await this.vocabularyRepository.findById(id);

    if (!vocabulary) {
      throw new NotFoundException(ErrorMessages.VOCABULARY.NOT_FOUND);
    }

    const result = await this.vocabularyRepository.update(id, data);

    const vocabularyResponse = plainToInstanceCustom(
      VocabularyResponse,
      result,
    );

    vocabularyResponse.examples = result.examples.map((item) => {
      return plainToInstanceCustom(ExampleSentenceDto, item);
    });

    return vocabularyResponse;
  }
}
