import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TopicService } from './topic.service';
import { ListTopicResponse } from './response/listTopic.response';
import { VerifiyGuard } from '../authentication/guard/verify.guard';
import { UserGuard } from '../authentication/guard/auth.guard';
import { TopicDto } from './dto/topic.dto';
import { CreateTopicDto } from './dto/createTopic.dto';

@Controller('topic')
@ApiTags('topic')
@ApiBearerAuth()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all topics' })
  @ApiOkResponse({
    description: 'Successfully fetched all topics',
    type: ListTopicResponse,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Number of items per page for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for topic name',
    type: String,
  })
  @UseGuards(UserGuard, VerifiyGuard)
  async getAllTopics(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search: string = '',
  ): Promise<ListTopicResponse> {
    return this.topicService.getAllTopics(page, perPage, search);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiBody({ type: CreateTopicDto })
  @ApiOkResponse({
    description: 'Successfully created a new topic',
    type: TopicDto,
  })
  @UseGuards(UserGuard, VerifiyGuard)
  async createTopic(@Body() request: CreateTopicDto): Promise<TopicDto> {
    return this.topicService.createTopic(request);
  }
}
