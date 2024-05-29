import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Prisma } from '@prisma/client';

@Injectable()
export class VocabularyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(data: any, userId: number) {
    const createData: any = {
      word: data.word,
      word_audio_url: data.word_audio_url,
      meaning: data.meaning,
      meaning_audio_url: data.meaning_audio_url,
      examples: data.examples,
      context: data.context,
      user: {
        connect: {
          id: userId,
        },
      },
      collection: {
        connect: {
          id: data.collection_id,
        },
      },
    };

    return this.prismaService.vocabulary.create({
      data: createData,
      include: {
        collection: true, // Include the connected topic
      },
    });
  }

  async update(id: number, data: any) {
    return this.prismaService.vocabulary.update({
      where: {
        id: id,
      },
      data: {
        word: data.word,
        meaning: data.meaning,
        examples: data.examples,
        context: data.context,
        word_audio_url: data.word_audio_url,
        meaning_audio_url: data.meaning_audio_url,
        collection: {
          connect: {
            id: data.collection_id,
          },
        },
      },
      include: {
        collection: true,
      },
    });
  }

  async delete(id: number) {
    return this.prismaService.vocabulary.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async getVocabularies(
    userId: number,
    page: number,
    perPage: number,
    search: string,
    collectionId?: number,
  ) {
    const whereCondition: Prisma.VocabularyWhereInput = {
      user_id: userId,
      AND: [
        {
          OR: [
            {
              meaning: {
                contains: search,
              },
            },
            {
              word: {
                contains: search,
              },
            },
          ],
        },
        {
          deleted_at: null,
        },
      ],
    };

    if (collectionId) {
      // Filter by the collection's ID using the nested relation
      whereCondition.collection = {
        id: collectionId,
      };
    }

    const data = await this.prismaService.vocabulary.findMany({
      where: whereCondition,
      skip: (page - 1) * perPage,
      include: {
        collection: true,
      },
      take: perPage,
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await this.prismaService.vocabulary.count({
      where: whereCondition,
    });

    return { data, total };
  }

  async batchDeleteByCollectionId(collectionId: number) {
    return this.prismaService.vocabulary.updateMany({
      where: {
        collection_id: collectionId,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findByIdAndUserId(vocabularyId: number, userId: number) {
    return this.prismaService.vocabulary.findFirst({
      where: {
        id: vocabularyId,
        user_id: userId,
        deleted_at: null,
      },
      include: {
        collection: true,
      },
    });
  }

  async countByCollectionId(collectionId: number) {
    return this.prismaService.vocabulary.count({
      where: {
        deleted_at: null,
        collection_id: collectionId,
      },
    });
  }
}
