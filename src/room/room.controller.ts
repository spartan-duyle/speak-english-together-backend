import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserGuard } from 'src/authentication/guard/auth.guard';
import { VerifiyGuard } from 'src/authentication/guard/verify.guard';
import { UserPayload } from 'src/authentication/types/user.payload';
import { GetUser } from 'src/authentication/decorator/get-user.decorator';
import CreateRoomDto from './dto/createRoom.dto';
import VideoSDKTokenResponse from './response/videoSDKToken.response';
import CreateRoomResponse from './response/createRoom.response';
import { ListRoomResponse } from './response/listRoom.response';

@Controller('room')
@ApiTags('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('video-sdk-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate videoSDK"s access token' })
  @ApiOkResponse({
    status: 200,
    description: 'Video SDK token generated successfully',
    type: VideoSDKTokenResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(UserGuard, VerifiyGuard)
  async generateVideoSDKToken(): Promise<VideoSDKTokenResponse> {
    return await this.roomService.generateVideoSDKToken();
  }

  @Post('')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({ type: CreateRoomDto })
  @ApiOkResponse({
    status: 201,
    description: 'Room created successfully',
    type: CreateRoomResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(UserGuard, VerifiyGuard)
  async createRoom(
    @GetUser() user: UserPayload,
    @Body() data: CreateRoomDto,
  ): Promise<CreateRoomResponse> {
    return await this.roomService.createRoom(user, data);
  }

  @Get('')
  @ApiOperation({ summary: 'List active rooms' })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'List of active rooms',
    type: ListRoomResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
    description: 'Search term for room name',
    type: String,
  })
  @ApiQuery({
    name: 'topicId',
    required: false,
    description: 'ID of the topic to filter rooms by',
    type: Number,
  })
  @UseGuards(UserGuard, VerifiyGuard)
  async listActiveRooms(
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
    @Query('topicId') topicId: number = null,
  ): Promise<ListRoomResponse> {
    return await this.roomService.listActiveRooms(
      page,
      perPage,
      search,
      topicId,
    );
  }
}
