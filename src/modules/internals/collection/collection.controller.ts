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
import { CollectionDto } from '@/modules/internals/collection/dto/collection.dto';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UserPayload } from '@/authentication/types/user.payload';
import { CollectionService } from '@/modules/internals/collection/collection.service';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import ListCollectionResponse from '@/modules/internals/collection/response/listCollection.response';
import CollectionResponse from '@/modules/internals/collection/response/collection.response';

@Controller('collection')
@ApiTags('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @ApiBody({ type: CollectionDto })
  @ApiOkResponse({ type: CollectionResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new collection' })
  async create(
    @Body() data: CollectionDto,
    @GetUser() user: UserPayload,
  ): Promise<CollectionResponse> {
    return this.collectionService.create(data, user.id);
  }

  @Get(':id')
  @ApiOkResponse({ type: CollectionResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a detailed collection' })
  async findOne(
    @Param('id') id: number,
    @GetUser() user: UserPayload,
  ): Promise<CollectionResponse> {
    return await this.collectionService.findByIdAndUserId(id, user.id);
  }

  @Get()
  @ApiOkResponse({ type: ListCollectionResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all collections' })
  async findAll(
    @GetUser() user: UserPayload,
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
  ): Promise<ListCollectionResponse> {
    return await this.collectionService.getCollections(
      user.id,
      page,
      perPage,
      search,
    );
  }

  @Put(':id')
  @ApiBody({ type: CollectionDto })
  @ApiOkResponse({ type: CollectionResponse })
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a collection' })
  async update(
    @Param('id') id: number,
    @Body() data: CollectionDto,
    @GetUser() user: UserPayload,
  ): Promise<CollectionResponse> {
    return await this.collectionService.update(data, user.id, id);
  }

  @Delete(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a collection' })
  @ApiOkResponse({
    type: CollectionResponse,
    description: 'Collection deleted successfully',
  })
  async delete(
    @Param('id') id: number,
    @GetUser() user: UserPayload,
  ): Promise<CollectionResponse> {
    return await this.collectionService.delete(user.id, id);
  }
}
