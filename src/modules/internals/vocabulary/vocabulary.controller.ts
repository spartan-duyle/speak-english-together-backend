import {
  Body,
  Controller, Delete,
  Get,
  HttpCode, Param,
  Post, Put,
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
import { ApiOkResponse } from '@nestjs/swagger';
import { ListVocabularyResponse } from '@/modules/internals/vocabulary/response/listVocabulary.response';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post('')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: VocabularyResponse })
  @HttpCode(200)
  async addToUser(
    @Body() addVocabularyDto: AddUpdateVocabularyDto,
    @GetUser() user: UserPayload,
  ): Promise<VocabularyResponse> {
    return await this.vocabularyService.create(addVocabularyDto, user.id);
  }

  @Get('')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: ListVocabularyResponse })
  async getVocabularies(
    @GetUser() user: UserPayload,
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
  ): Promise<ListVocabularyResponse> {
    return await this.vocabularyService.getVocabularies(
      user.id,
      page,
      perPage,
      search,
    );
  }

  @Get(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: VocabularyResponse })
  async getVocabulary(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ): Promise<VocabularyResponse> {
    return await this.vocabularyService.getVocabulary(id);
  }

  @Delete(':id')
  @UseGuards(UserGuard, VerifyGuard)
  async deleteVocabulary(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ) {
    return await this.vocabularyService.deleteVocabulary(id);
  }

  @Put(':id')
  @UseGuards(UserGuard, VerifyGuard)
  async updateVocabulary(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
    @Body() updateVocabularyDto: AddUpdateVocabularyDto,
  ) {
    return await this.vocabularyService.updateVocabulary(
      id,
      updateVocabularyDto,
    );
  }
}
