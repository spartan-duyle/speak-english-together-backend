import { Injectable, NotFoundException } from '@nestjs/common';
import { VocabularyRepository } from '@/modules/internals/vocabulary/vocabulary.repository';
import { AddUpdateVocabularyDto } from '@/modules/internals/vocabulary/dto/addUpdateVocabularyDto';
import { VocabularyResponse } from '@/modules/internals/vocabulary/response/vocabulary.response';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import { ExampleSentenceDto } from '@/modules/internals/vocabulary/dto/exampleSentence.dto';
import { ListVocabularyResponse } from '@/modules/internals/vocabulary/response/listVocabulary.response';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import { GoogleSpeechService } from '@/google-speech/google-speech.service';
import CollectionResponse from '@/modules/internals/collection/response/collection.response';
import { CollectionRepository } from '@/modules/internals/collection/collection.repository';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly googleSpeechService: GoogleSpeechService,
    private readonly collectionRepository: CollectionRepository,
  ) {}

  async create(
    data: AddUpdateVocabularyDto,
    userId: number,
  ): Promise<VocabularyResponse> {
    if (!data.word_audio_url) {
      data.word_audio_url = await this.googleSpeechService.textToSpeech(
        data.word,
      );
    }
    if (!data.meaning_audio_url) {
      data.meaning_audio_url = await this.googleSpeechService.textToSpeech(
        data.meaning,
      );
    }

    const collection = await this.collectionRepository.findByIdAndUserId(
      data.collection_id,
      userId,
    );

    if (!collection) {
      throw new NotFoundException(ErrorMessages.COLLECTION.NOT_FOUND);
    }

    const result = await this.vocabularyRepository.insert(data, userId);
    const vocabularyResponse = plainToInstanceCustom(
      VocabularyResponse,
      result,
    );
    vocabularyResponse.examples = result.examples.map((item) => {
      return plainToInstanceCustom(ExampleSentenceDto, item);
    });

    vocabularyResponse.collection = plainToInstanceCustom(
      CollectionResponse,
      result.collection,
    );

    return vocabularyResponse;
  }

  async getVocabularies(
    userId: number,
    page: number,
    perPage: number,
    search: string,
    collectionId?: number,
  ): Promise<ListVocabularyResponse> {
    const { data, total } = await this.vocabularyRepository.getVocabularies(
      userId,
      page || 1,
      perPage || 10,
      search,
      collectionId,
    );

    const vocabularies = data.map((item) => {
      const vocabularyResponse = plainToInstanceCustom(
        VocabularyResponse,
        item,
      );
      vocabularyResponse.examples = item.examples.map((example) => {
        return plainToInstanceCustom(ExampleSentenceDto, example);
      });

      vocabularyResponse.collection = plainToInstanceCustom(
        CollectionResponse,
        item.collection,
      );

      return vocabularyResponse;
    });

    return {
      data: vocabularies,
      total,
    };
  }

  async getVocabulary(vocabularyId: number, userId: number) {
    const data = await this.vocabularyRepository.findByIdAndUserId(
      vocabularyId,
      userId,
    );

    if (!data) {
      throw new NotFoundException(ErrorMessages.VOCABULARY.NOT_FOUND);
    }

    const vocabularyResponse = plainToInstanceCustom(VocabularyResponse, data);
    vocabularyResponse.examples = data.examples.map((item) => {
      return plainToInstanceCustom(ExampleSentenceDto, item);
    });
    vocabularyResponse.collection = plainToInstanceCustom(
      CollectionResponse,
      data.collection,
    );
    return vocabularyResponse;
  }

  async deleteVocabulary(vocabularyId: number, userId: number) {
    const data = await this.vocabularyRepository.findByIdAndUserId(
      vocabularyId,
      userId,
    );

    if (!data) {
      throw new NotFoundException(ErrorMessages.VOCABULARY.NOT_FOUND);
    }

    return await this.vocabularyRepository.delete(vocabularyId);
  }

  async updateVocabulary(
    vocabularyId: number,
    userId: number,
    data: AddUpdateVocabularyDto,
  ): Promise<VocabularyResponse> {
    const vocabulary = await this.vocabularyRepository.findByIdAndUserId(
      vocabularyId,
      userId,
    );

    if (!vocabulary) {
      throw new NotFoundException(ErrorMessages.VOCABULARY.NOT_FOUND);
    }

    const collection = await this.collectionRepository.findByIdAndUserId(
      data.collection_id,
      userId,
    );

    if (!collection) {
      throw new NotFoundException(ErrorMessages.COLLECTION.NOT_FOUND);
    }

    if (vocabulary.word !== data.word) {
      data.word_audio_url = await this.googleSpeechService.textToSpeech(
        data.word,
      );
    }

    if (vocabulary.meaning !== data.meaning) {
      data.meaning_audio_url = await this.googleSpeechService.textToSpeech(
        data.meaning,
      );
    }

    const result = await this.vocabularyRepository.update(vocabularyId, data);

    const vocabularyResponse = plainToInstanceCustom(
      VocabularyResponse,
      result,
    );

    vocabularyResponse.examples = result.examples.map((item) => {
      return plainToInstanceCustom(ExampleSentenceDto, item);
    });

    vocabularyResponse.collection = plainToInstanceCustom(
      CollectionResponse,
      result.collection,
    );

    return vocabularyResponse;
  }
}
