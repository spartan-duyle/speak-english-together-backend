import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.serivce';

@Injectable()
export class TopicRepository {
  constructor(private readonly prismaService: PrismaService) {
  }

  async getAllTopics(page: number, perPage: number, search: string) {
    const skip = (page - 1) * perPage;

    const topics = await this.prismaService.topic.findMany({
      skip: skip,
      take: perPage,
      where: {
        name: {
          contains: search,
        },
        deleted_at: null,
      },
    });

    const total = await this.prismaService.topic.count({
      where: {
        name: {
          contains: search,
        },
        deleted_at: null,
      },
    });

    return {
      data: topics,
      total: total,
    };
  }

  async createTopic(data: any) {
    return this.prismaService.topic.create({
      data: {
        name: data.name,
        image: data.image,
        content: data.content,
      },
    });
  }

  async getTopicByName(name: string) {
    return this.prismaService.topic.findUnique({
      where: {
        name: name,
        deleted_at: null,
      },
    });
  }

  async getTopicById(id: number) {
    return this.prismaService.topic.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
    });
  }
}
