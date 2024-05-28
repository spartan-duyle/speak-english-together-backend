import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CollectionDto } from '@/modules/internals/collection/dto/collection.dto';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import { CollectionRepository } from '@/modules/internals/collection/collection.repository';
import ListCollectionResponse from '@/modules/internals/collection/response/listCollection.response';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import { VocabularyRepository } from '@/modules/internals/vocabulary/vocabulary.repository';
import CollectionResponse from '@/modules/internals/collection/response/collection.response';

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async create(
    data: CollectionDto,
    userId: number,
  ): Promise<CollectionResponse> {
    const collection = await this.collectionRepository.findByNameAndUserId(
      data.name,
      userId,
    );

    if (collection) {
      throw new BadRequestException(
        ErrorMessages.COLLECTION.ALREADY_EXISTS,
      );
    }
    const result = this.collectionRepository.insert(data, userId);
    return plainToInstanceCustom(CollectionResponse, result);
  }

  async getCollections(
    userId: number,
    page: number,
    perPage: number,
    search: string,
  ): Promise<ListCollectionResponse> {
    const { data, total } = await this.collectionRepository.getCollections(
      userId,
      page || 1,
      perPage || 10,
      search,
    );

    const collections = await Promise.all(
      data.map(async (item: any) => {
        const numberOfVocabularies =
          await this.vocabularyRepository.countByCollectionId(item.id);
        const result = plainToInstanceCustom(CollectionResponse, item);
        result.number_of_vocabularies = numberOfVocabularies;
        return result;
      }),
    );

    return { data: collections, total };
  }

  async update(
    data: CollectionDto,
    userId: number,
    collectionId: number,
  ): Promise<CollectionResponse> {
    const existingCollection = await this.findByIdAndUserId(
      collectionId,
      userId,
    );

    const result = await this.collectionRepository.update(
      data,
      existingCollection.id,
    );

    return plainToInstanceCustom(CollectionResponse, result);
  }

  async delete(
    userId: number,
    collectionId: number,
  ): Promise<CollectionResponse> {
    const existingCollection = await this.findByIdAndUserId(
      collectionId,
      userId,
    );

    // Delete all vocabularies of this topic
    await this.vocabularyRepository.batchDeleteByCollectionId(existingCollection.id);

    const result = await this.collectionRepository.delete(collectionId);
    return plainToInstanceCustom(CollectionResponse, result);
  }

  async findByIdAndUserId(vocabularyTopicId: number, userId: number) {
    const existingCollection =
      await this.collectionRepository.findByIdAndUserId(
        vocabularyTopicId,
        userId,
      );

    if (!existingCollection) {
      throw new NotFoundException(ErrorMessages.COLLECTION.NOT_FOUND);
    }

    const numberOfVocabularies =
      await this.vocabularyRepository.countByCollectionId(
        existingCollection.id,
      );
    const result = plainToInstanceCustom(
      CollectionResponse,
      existingCollection,
    );
    result.number_of_vocabularies = numberOfVocabularies;
    return result;
  }
}
