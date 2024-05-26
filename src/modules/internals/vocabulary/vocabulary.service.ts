import { Injectable, NotFoundException } from '@nestjs/common';
import { VocabularyRepository } from '@/modules/internals/vocabulary/vocabulary.repository';
import { AddUpdateVocabularyDto } from '@/modules/internals/vocabulary/dto/addUpdateVocabularyDto';
import { VocabularyResponse } from '@/modules/internals/vocabulary/response/vocabulary.response';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import { ExampleSentenceDto } from '@/modules/internals/vocabulary/dto/exampleSentence.dto';
import { ListVocabularyResponse } from '@/modules/internals/vocabulary/response/listVocabulary.response';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import { GoogleSpeechService } from '@/google-speech/google-speech.service';
import { VocabularyTopicDto } from '@/modules/internals/vocabularyTopic/dto/vocabularyTopicDto';
import VocabularyTopicResponse from '@/modules/internals/vocabularyTopic/response/vocabularyTopic.response';
import { VocabularyTopicRepository } from '@/modules/internals/vocabularyTopic/vocabularyTopic.repository';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly googleSpeechService: GoogleSpeechService,
    private readonly vocabularyTopicRepository: VocabularyTopicRepository,
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

    if (data.topic_id) {
      const topic = await this.vocabularyTopicRepository.findByIdAndUserId(
        data.topic_id,
        userId,
      );
      if (!topic) {
        throw new NotFoundException(ErrorMessages.VOCABULARY_TOPIC.NOT_FOUND);
      }
    }

    const result = await this.vocabularyRepository.insert(data, userId);
    const vocabularyResponse = plainToInstanceCustom(
      VocabularyResponse,
      result,
    );
    vocabularyResponse.examples = result.examples.map((item) => {
      return plainToInstanceCustom(ExampleSentenceDto, item);
    });

    vocabularyResponse.topic = plainToInstanceCustom(
      VocabularyTopicResponse,
      result.vocabulary_topic,
    );

    return vocabularyResponse;
  }

  async getVocabularies(
    userId: number,
    page: number,
    perPage: number,
    search: string,
    vocabularyTopicId?: number,
  ): Promise<ListVocabularyResponse> {
    const { data, total } = await this.vocabularyRepository.getVocabularies(
      userId,
      page || 1,
      perPage || 10,
      search,
      vocabularyTopicId,
    );

    const vocabularies = data.map((item) => {
      const vocabularyResponse = plainToInstanceCustom(
        VocabularyResponse,
        item,
      );
      vocabularyResponse.examples = item.examples.map((example) => {
        return plainToInstanceCustom(ExampleSentenceDto, example);
      });

      vocabularyResponse.topic = plainToInstanceCustom(
        VocabularyTopicResponse,
        item.vocabulary_topic,
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
    vocabularyResponse.topic = plainToInstanceCustom(
      VocabularyTopicResponse,
      data.vocabulary_topic,
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

    if (data.topic_id) {
      const topic = await this.vocabularyRepository.findByIdAndUserId(
        data.topic_id,
        userId,
      );
      if (!topic) {
        throw new NotFoundException(ErrorMessages.VOCABULARY_TOPIC.NOT_FOUND);
      }
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

    vocabularyResponse.topic = plainToInstanceCustom(
      VocabularyTopicResponse,
      result.vocabulary_topic,
    );

    return vocabularyResponse;
  }
}
