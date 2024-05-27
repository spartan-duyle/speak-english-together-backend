import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VocabularyTopicDto } from '@/modules/internals/vocabularyTopic/dto/vocabularyTopicDto';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UserPayload } from '@/authentication/types/user.payload';
import { VocabularyTopicService } from '@/modules/internals/vocabularyTopic/vocabularyTopic.service';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import ListVocabularyTopicResponse from '@/modules/internals/vocabularyTopic/response/listVocabularyTopic.response';
import VocabularyTopicResponse from '@/modules/internals/vocabularyTopic/response/vocabularyTopic.response';

@Controller('vocabulary-topic')
@ApiTags('Vocabulary Topics')
export class VocabularyTopicController {
  constructor(
    private readonly vocabularyTopicService: VocabularyTopicService,
  ) {}

  @Post()
  @ApiBody({ type: VocabularyTopicDto })
  @ApiOkResponse({ type: VocabularyTopicResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vocabulary topic' })
  async create(
    @Body() data: VocabularyTopicDto,
    @GetUser() user: UserPayload,
  ): Promise<VocabularyTopicResponse> {
    return this.vocabularyTopicService.create(data, user.id);
  }

  @Get(':id')
  @ApiOkResponse({ type: VocabularyTopicResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a vocabulary topic' })
  async findOne(
    @Param('id') id: number,
    @GetUser() user: UserPayload,
  ): Promise<VocabularyTopicResponse> {
    return await this.vocabularyTopicService.findByIdAndUserId(id, user.id);
  }

  @Get()
  @ApiOkResponse({ type: ListVocabularyTopicResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all vocabulary topics' })
  async findAll(
    @GetUser() user: UserPayload,
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
  ): Promise<ListVocabularyTopicResponse> {
    return await this.vocabularyTopicService.getVocabularyTopics(
      user.id,
      page,
      perPage,
      search,
    );
  }

  @Put(':id')
  @ApiBody({ type: VocabularyTopicDto })
  @ApiOkResponse({ type: VocabularyTopicResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vocabulary topic' })
  async update(
    @Param('id') id: number,
    @Body() data: VocabularyTopicDto,
    @GetUser() user: UserPayload,
  ): Promise<VocabularyTopicResponse> {
    return await this.vocabularyTopicService.update(data, user.id, id);
  }

  @Delete(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vocabulary topic' })
  @ApiOkResponse({
    type: VocabularyTopicResponse,
    description: 'Vocabulary topic deleted successfully',
  })
  async delete(
    @Param('id') id: number,
    @GetUser() user: UserPayload,
  ): Promise<VocabularyTopicResponse> {
    return await this.vocabularyTopicService.delete(user.id, id);
  }
}
