import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { ListTopicResponse } from './response/listTopic.response';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import { TopicDto } from './dto/topic.dto';
import { CreateTopicDto } from './dto/createTopic.dto';
import { TopicRepository } from '@/modules/internals/topic/topic.repository';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';

@Injectable()
export class TopicService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicRepository: TopicRepository,
  ) {}

  async getAllTopics(
    page: number,
    perPage: number,
    search: string,
  ): Promise<ListTopicResponse> {
    const { data, total } = await this.topicRepository.getAllTopics(
      page || 1,
      perPage || 10,
      search,
    );

    const mappedTopics = data.map((topic) => {
      return plainToInstanceCustom(TopicDto, topic);
    });

    return {
      data: mappedTopics,
      total: total,
    };
  }

  async createTopic(request: CreateTopicDto): Promise<TopicDto> {
    const existingTopic = await this.topicRepository.getTopicByName(
      request.name,
    );

    if (existingTopic) {
      throw new BadRequestException(ErrorMessages.TOPIC.ALREADY_EXISTS);
    }

    const topic = await this.topicRepository.createTopic(request);

    return plainToInstanceCustom(TopicDto, topic);
  }

  async getTopicById(id: number): Promise<TopicDto> {
    const topic = await this.topicRepository.getTopicById(id);

    if (!topic) {
      throw new NotFoundException(ErrorMessages.TOPIC.NOT_FOUND);
    }

    return plainToInstanceCustom(TopicDto, topic);
  }
}
