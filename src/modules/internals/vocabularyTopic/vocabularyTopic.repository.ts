import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Prisma } from '@prisma/client';

@Injectable()
export class VocabularyTopicRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(data: any, userId: number) {
    return this.prismaService.vocabularyTopic.create({
      data: {
        name: data.name,
        description: data.description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findByNameAndUserId(name: string, userId: number) {
    return this.prismaService.vocabularyTopic.findFirst({
      where: {
        name,
        user_id: userId,
        deleted_at: null,
      },
    });
  }

  async getVocabularyTopics(
    userId: number,
    page: number,
    perPage: number,
    search: string,
  ) {
    const whereCondition: Prisma.VocabularyTopicWhereInput = {
      user_id: userId,
      AND: [
        {
          OR: [
            {
              name: {
                contains: search,
              },
            },
          ],
          deleted_at: null,
        },
      ],
    };

    const data = await this.prismaService.vocabularyTopic.findMany({
      where: whereCondition,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const total = await this.prismaService.vocabularyTopic.count({
      where: whereCondition,
    });

    return { data, total };
  }

  async findByIdAndUserId(vocabularyTopicId: number, userId: number) {
    return this.prismaService.vocabularyTopic.findFirst({
      where: {
        id: vocabularyTopicId,
        user_id: userId,
        deleted_at: null,
      },
    });
  }

  async update(data: any, vocabularyTopicId: number) {
    return this.prismaService.vocabularyTopic.update({
      where: {
        id: vocabularyTopicId,
      },
      data: {
        name: data.name,
        description: data.description,
        updated_at: new Date(),
      },
    });
  }

  async delete(vocabularyTopicId: number) {
    return this.prismaService.vocabularyTopic.update({
      where: {
        id: vocabularyTopicId,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
