import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VocabularyService } from '@/modules/internals/vocabulary/vocabulary.service';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UserPayload } from '@/authentication/types/user.payload';
import { AddUpdateVocabularyDto } from '@/modules/internals/vocabulary/dto/addUpdateVocabularyDto';
import { VocabularyResponse } from '@/modules/internals/vocabulary/response/vocabulary.response';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListVocabularyResponse } from '@/modules/internals/vocabulary/response/listVocabulary.response';

@Controller('vocabulary')
@ApiTags('Vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post('')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: VocabularyResponse })
  @HttpCode(201)
  @ApiOperation({ summary: 'Add a new vocabulary' })
  async addToUser(
    @Body() addVocabularyDto: AddUpdateVocabularyDto,
    @GetUser() user: UserPayload,
  ): Promise<VocabularyResponse> {
    return await this.vocabularyService.create(addVocabularyDto, user.id);
  }

  @Get('')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: ListVocabularyResponse })
  @ApiOperation({ summary: 'Get all vocabularies' })
  async getVocabularies(
    @GetUser() user: UserPayload,
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
    @Query('collectionId') collectionId: number = null,
  ): Promise<ListVocabularyResponse> {
    return await this.vocabularyService.getVocabularies(
      user.id,
      page,
      perPage,
      search,
      collectionId,
    );
  }

  @Get(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: VocabularyResponse })
  @ApiOperation({ summary: 'Get a vocabulary' })
  async getVocabulary(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ): Promise<VocabularyResponse> {
    return await this.vocabularyService.getVocabulary(id, user.id);
  }

  @Delete(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOperation({ summary: 'Delete a vocabulary' })
  async deleteVocabulary(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ) {
    return await this.vocabularyService.deleteVocabulary(id, user.id);
  }

  @Put(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOperation({ summary: 'Update a vocabulary' })
  @ApiOkResponse({ type: VocabularyResponse })
  async updateVocabulary(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
    @Body() updateVocabularyDto: AddUpdateVocabularyDto,
  ) {
    return await this.vocabularyService.updateVocabulary(
      id,
      user.id,
      updateVocabularyDto,
    );
  }
}
