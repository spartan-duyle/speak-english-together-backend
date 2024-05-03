import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { RoomService } from './room.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { APISummaries } from 'src/helpers/helpers';
import { UserGuard } from 'src/authentication/guard/auth.guard';
import { VerifiyGuard } from 'src/authentication/guard/verify.guard';
import { UserPayload } from 'src/authentication/types/user.payload';
import { GetUser } from 'src/authentication/decorator/get-user.decorator';
import CreateRoomDto from './dto/createRoom.dto';
import VideoSDKTokenResponse from './response/videoSDKToken.response';
import CreateRoomResponse from './response/createRoom.response';

@Controller('room')
@ApiTags('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('video-sdk-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: APISummaries.USER })
  @UseGuards(UserGuard, VerifiyGuard)
  @ApiOkResponse({ type: VideoSDKTokenResponse })
  async generateVideoSDKToken(): Promise<VideoSDKTokenResponse> {
    return await this.roomService.generateVideoSDKToken();
  }

  @Post('')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: APISummaries.USER })
  @UseGuards(UserGuard, VerifiyGuard)
  @ApiOkResponse({ type: CreateRoomResponse })
  async createRoom(
    @GetUser() user: UserPayload,
    @Body() data: CreateRoomDto,
  ): Promise<CreateRoomResponse> {
    return await this.roomService.createRoom(user, data);
  }
}
