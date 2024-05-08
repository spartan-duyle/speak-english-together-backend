import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.serivce';
import { ListTopicResponse } from './response/listTopic.response';
import { plainToInstanceCustom } from '../helpers/helpers';
import { TopicDto } from './dto/topic.dto';
import { CreateTopicDto } from './dto/createTopic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTopics(
    page: number,
    perPage: number,
    search: string,
  ): Promise<ListTopicResponse> {
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

    const mappedTopics = topics.map((topic) => {
      return plainToInstanceCustom(TopicDto, topic);
    });

    return {
      data: mappedTopics,
      total: total,
    };
  }

  async createTopic(request: CreateTopicDto): Promise<TopicDto> {
    const existingTopic = await this.prismaService.topic.findFirst({
      where: {
        name: request.name,
      },
    });

    if (existingTopic) {
      throw new BadRequestException('Topic already exists');
    }

    const topic = await this.prismaService.topic.create({
      data: {
        name: request.name,
        image: request.image,
      },
    });

    return plainToInstanceCustom(TopicDto, topic);
  }
}
