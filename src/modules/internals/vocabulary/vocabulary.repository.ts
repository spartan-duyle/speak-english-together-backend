import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.serivce';

@Injectable()
export class VocabularyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: any, userId: number) {
    return this.prismaService.vocabulary.create({
      data: {
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
      },
    });
  }

  async find() {
    return 'vocabulary';
  }

  async findById(id: number) {
    return this.prismaService.vocabulary.findUnique({
      where: {
        id,
        deleted_at: null,
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
  ) {
    const data = await this.prismaService.vocabulary.findMany({
      where: {
        user_id: userId,
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
        deleted_at: null,
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await this.prismaService.vocabulary.count({
      where: {
        user_id: userId,
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
        deleted_at: null,
      },
    });

    return { data, total };
  }
}
