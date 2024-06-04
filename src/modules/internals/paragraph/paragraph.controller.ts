import {
  Body,
  Controller, Delete,
  Get,
  HttpCode, Param,
  Post, Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParagraphService } from '@/modules/internals/paragraph/paragraph.service';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UserPayload } from '@/authentication/types/user.payload';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import ParagraphCreateDto from '@/modules/internals/paragraph/dto/paragraphCreate.dto';
import ParagraphResponse from '@/modules/internals/paragraph/response/paragraph.response';
import { QuestionLevelEnum } from '@/common/enum/questionLevel.enum';
import ListParagraphResponse from '@/modules/internals/paragraph/response/listParagraph.response';
import { ParagraphUpdateDto } from '@/modules/internals/paragraph/dto/paragraphUpdate.dto';

@Controller('paragraph')
@ApiTags('Paragraph')
export class ParagraphController {
  constructor(private readonly paragraphService: ParagraphService) {}

  @UseGuards(UserGuard, VerifyGuard)
  @HttpCode(200)
  @Post()
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBody({ type: ParagraphCreateDto })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: ParagraphResponse })
  async create(
    @GetUser() user: UserPayload,
    @Body() data: ParagraphCreateDto,
  ): Promise<ParagraphResponse> {
    return await this.paragraphService.create(user.id, data);
  }

  @Get()
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBody({ type: ParagraphCreateDto })
  async getAllParagraphs(
    @GetUser() user: UserPayload,
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
    @Query('topicId') topicId: number = null,
    @Query('level') level: QuestionLevelEnum = null,
  ): Promise<ListParagraphResponse> {
    return await this.paragraphService.getAllParagraphs(
      user.id,
      page,
      perPage,
      search,
      topicId,
      level,
    );
  }

  @Get(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: ParagraphResponse })
  async getParagraphById(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ): Promise<ParagraphResponse> {
    return await this.paragraphService.getParagraphById(user.id, id);
  }

  @Put(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: ParagraphResponse })
  async updateParagraph(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
    @Body() data: ParagraphUpdateDto,
  ): Promise<ParagraphResponse> {
    return await this.paragraphService.updateParagraph(user.id, id, data);
  }

  @Delete(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiOkResponse({ type: ParagraphResponse })
  async deleteParagraph(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ): Promise<ParagraphResponse> {
    return await this.paragraphService.deleteParagraph(user.id, id);
  }
}
