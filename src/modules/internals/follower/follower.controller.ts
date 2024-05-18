import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FollowerService } from '@/modules/internals/follower/follower.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UserPayload } from '@/authentication/types/user.payload';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import FollowResponse from '@/modules/internals/follower/response/follow.response';
import UnFollowResponse from '@/modules/internals/follower/response/unFollow.response';
import ListFollowerResponse from '@/modules/internals/follower/response/listFollower.response';
import ListFollowingResponse from '@/modules/internals/follower/response/listFollowing.response';

@Controller('user-follower')
@ApiTags('user-follower')
@ApiBearerAuth()
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Put('follow/:followedId')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiOkResponse({
    status: 200,
    description: 'User followed successfully',
    type: FollowResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async followUser(
    @GetUser() user: UserPayload,
    @Param('followedId') followedId: number,
  ): Promise<FollowResponse> {
    return await this.followerService.followUser(user.id, followedId);
  }

  @Put('unfollow/:followedId')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiOkResponse({
    status: 200,
    description: 'User unfollowed successfully',
    type: UnFollowResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async unfollowUser(
    @GetUser() user: UserPayload,
    @Param('followedId') followedId: number,
  ): Promise<UnFollowResponse> {
    return await this.followerService.unfollowUser(user.id, followedId);
  }

  @Get('followers/:userId')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get followers' })
  @ApiOkResponse({
    status: 200,
    description: 'Get followers successfully',
    type: ListFollowerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getFollowers(
    @GetUser() user: UserPayload,
    @Param('userId') userId: number,
    @Query('search') search: string = '',
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
  ): Promise<ListFollowerResponse> {
    return await this.followerService.getFollowers(
      user.id,
      userId,
      search,
      page,
      perPage,
    );
  }

  @Get('following/:userId')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get following' })
  @ApiOkResponse({
    status: 200,
    description: 'Get following successfully',
    type: ListFollowerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getFollowing(
    @GetUser() user: UserPayload,
    @Param('userId') userId: number,
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
  ): Promise<ListFollowingResponse> {
    return await this.followerService.getFollowing(
      user.id,
      userId,
      search,
      page,
      perPage,
    );
  }
}
