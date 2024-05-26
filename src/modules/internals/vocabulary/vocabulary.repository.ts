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
    };

    // Check if topic_id is provided and valid
    if (data.topic_id) {
      const topicExists = await this.prismaService.vocabularyTopic.findUnique({
        where: {
          id: data.topic_id,
        },
      });

      if (topicExists) {
        createData.vocabulary_topic = {
          connect: {
            id: data.topic_id,
          },
        };
      }
    }

    return this.prismaService.vocabulary.create({
      data: createData,
      include: {
        vocabulary_topic: true, // Include the connected topic
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
        vocabulary_topic: {
          connect: {
            id: data.topic_id,
          },
        },
      },
      include: {
        vocabulary_topic: true,
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
    vocabularyTopicId?: number,
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

    if (vocabularyTopicId) {
      // Filter by the topic's ID using the nested relation
      whereCondition.vocabulary_topic = {
        id: vocabularyTopicId,
      };
    }

    console.log(whereCondition);

    const data = await this.prismaService.vocabulary.findMany({
      where: whereCondition,
      skip: (page - 1) * perPage,
      include: {
        vocabulary_topic: true,
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

  async batchDeleteByTopicId(vocabularyTopicId: number) {
    return this.prismaService.vocabulary.updateMany({
      where: {
        vocabulary_topic_id: vocabularyTopicId,
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
        vocabulary_topic: true,
      },
    });
  }
}
