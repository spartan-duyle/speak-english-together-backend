import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/auth.guard';
import { VerifyGuard } from 'src/common/guards/verify.guard';
import { UserPayload } from 'src/authentication/types/user.payload';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import CreateRoomDto from './dto/createRoom.dto';
import VideoSDKTokenResponse from './response/videoSDKToken.response';
import CreateRoomResponse from './response/createRoom.response';
import { ListRoomResponse } from './response/listRoom.response';
import { JoinRoomDto } from './dto/joinRoom.dto';
import { RoomResponse } from '@/features/internals/room/response/room.response';

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
  @UseGuards(UserGuard, VerifyGuard)
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
  @UseGuards(UserGuard, VerifyGuard)
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
  @UseGuards(UserGuard, VerifyGuard)
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

  @Put(':id/join')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a room' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the room to join',
    type: Number,
  })
  @ApiBody({ type: JoinRoomDto })
  @ApiOkResponse({
    status: 200,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(UserGuard, VerifyGuard)
  async joinRoom(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
    @Body() request: JoinRoomDto,
  ): Promise<void> {
    await this.roomService.joinRoom(user, id, request);
  }

  @Put(':id/leave')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a room' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the room to leave',
    type: Number,
  })
  @ApiOkResponse({
    status: 200,
    description: 'Left room successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(UserGuard, VerifyGuard)
  async leaveRoom(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ): Promise<void> {
    await this.roomService.leaveRoom(user, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room details' })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Room details fetched successfully',
    type: RoomResponse,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the room to get details',
    type: Number,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse({ status: 404, description: 'Not Found' })
  @UseGuards(UserGuard, VerifyGuard)
  async getRoomDetails(@Param('id') id: number): Promise<RoomResponse> {
    return await this.roomService.getRoomDetails(id);
  }
}
