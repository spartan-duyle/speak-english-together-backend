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
import UserService from './user.service';
import { UserPayload } from '@/authentication/types/user.payload';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import ListUserResponse from '@/modules/internals/user/response/listUser.response';
import UserResponse from '@/modules/internals/user/response/userResponse';

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
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async userProfile(@GetUser() user: UserPayload): Promise<UserResponse> {
    return await this.userService.userProfile(user.id);
  }

  @Put('me')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateUserProfile(
    @GetUser() user: UserPayload,
    @Body() data: UpdateUserDto,
  ): Promise<UserResponse> {
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
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async changePassword(
    @GetUser() user: UserPayload,
    @Body() data: ChangePasswordDto,
  ) {
    await this.userService.changePassword(user.id, data);
  }

  @Get('')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the list of users' })
  @ApiOkResponse({
    status: 200,
    type: ListUserResponse,
    description: 'List of users fetched successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getUsers(
    @GetUser() user: UserPayload,
    @Query('page') page: number = null,
    @Query('perPage') perPage: number = null,
    @Query('search') search: string = '',
  ): Promise<ListUserResponse> {
    return await this.userService.listUsers(user.id, page, perPage, search);
  }

  @Get(':id')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({
    status: 200,
    description: 'User fetched successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async userDetail(
    @GetUser() user: UserPayload,
    @Param('id') id: number,
  ): Promise<UserResponse> {
    return await this.userService.userDetail(user.id, id);
  }

  @Post('migrate-comet-chat-uid')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBearerAuth()
  async migrateCometChatUid(): Promise<void> {
    return await this.userService.migrateCometChatUid();
  }
}
