import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { APISummaries } from 'src/helpers/helpers';
import { UserGuard } from 'src/authentication/guard/auth.guard';
import { VerifiyGuard } from 'src/authentication/guard/verify.guard';
import { UserPayload } from 'src/authentication/types/user.payload';
import { GetUser } from 'src/authentication/decorator/get-user.decorator';
import CreateRoomDto from './dto/createRoom.dto';

@Controller('room')
@ApiTags('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('video-sdk-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: APISummaries.USER })
  @UseGuards(UserGuard, VerifiyGuard)
  @ApiBearerAuth()
  async generateVideoSDKToken() {
    return await this.roomService.generateVideoSDKToken();
  }

  @Post('')
  @ApiBearerAuth()
  @ApiOperation({ summary: APISummaries.USER })
  @UseGuards(UserGuard, VerifiyGuard)
  async createRoom(@GetUser() user: UserPayload, @Body() data: CreateRoomDto) {
    return await this.roomService.createRoom(user, data);
  }
}
