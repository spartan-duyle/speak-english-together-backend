import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserGuard } from 'src/authentication/guard/auth.guard';
import { VerifiyGuard } from 'src/authentication/guard/verify.guard';
import { UserPayload } from 'src/authentication/types/user.payload';
import { GetUser } from 'src/authentication/decorator/get-user.decorator';
import CreateRoomDto from './dto/createRoom.dto';
import VideoSDKTokenResponse from './response/videoSDKToken.response';
import CreateRoomResponse from './response/createRoom.response';

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
}
