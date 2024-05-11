import { Body, Controller, Get, HttpCode, Post, Put, UseGuards } from '@nestjs/common';
import UserService from './user.service';
import { UserPayload } from '../../../authentication/types/user.payload';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserProfileResponse } from './response/userProfile.response';
import { UserGuard } from '../../../common/guards/auth.guard';
import { VerifyGuard } from '../../../common/guards/verify.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({
    status: 200,
    description: 'User profile fetched successfully',
    type: UserProfileResponse,
  })
  @ApiOkResponse({ status: 401, description: 'Unauthorized' })
  @ApiOkResponse({ status: 403, description: 'Forbidden' })
  @ApiOkResponse({ status: 404, description: 'Not Found' })
  async userProfile(
    @GetUser() user: UserPayload,
  ): Promise<UserProfileResponse> {
    return await this.userService.userProfile(user.id);
  }

  @Put('me')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserProfileResponse,
  })
  @ApiOkResponse({ status: 401, description: 'Unauthorized' })
  @ApiOkResponse({ status: 403, description: 'Forbidden' })
  @ApiOkResponse({ status: 404, description: 'Not Found' })
  async updateUserProfile(
    @GetUser() user: UserPayload,
    @Body() data: UpdateUserDto,
  ): Promise<UserProfileResponse> {
    return await this.userService.updateUserProfile(user.id, data);
  }

  @Post('me/change-password')
  @UseGuards(UserGuard, VerifyGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiOkResponse({ status: 401, description: 'Unauthorized' })
  @ApiOkResponse({ status: 403, description: 'Forbidden' })
  @ApiOkResponse({ status: 404, description: 'Not Found' })
  async changePassword(
    @GetUser() user: UserPayload,
    @Body() data: ChangePasswordDto,
  ) {
    await this.userService.changePassword(user.id, data);
  }
}