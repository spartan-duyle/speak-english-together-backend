import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import AuthenticationService from './authetication.service';
import RegisterDto from './dto/register.dto';
import { MailService } from 'src/shared/mail/mail.service';
import { UserModel } from 'src/features/internals/user/model/user.model';
import { AuthModel } from './model/auth.model';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';

@Controller('auth')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Register a new account' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: UserModel })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Account registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const response = await this.authService.registerUser(dto);
    await this.mailService.sendEmailConfirmation({
      email: dto.email,
      name: dto.full_name,
    });
    return response;
  }

  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthModel })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthModel })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('refresh')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @ApiOperation({ summary: 'Verify account' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: String })
  @ApiBody({ type: VerifyUserDto })
  @ApiResponse({ status: 200, description: 'Account verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get('verify')
  async verify(@Query() query: VerifyUserDto) {
    const email = await this.authService.decodeConfirmationToken(query.token);
    return await this.authService.verify(email);
  }

  // @ApiOperation({ summary: APISummaries.UNAUTH })
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: String })
  // @Post('request-reset-password')
  // resetPasswordRequest(@Body() dto: RequestResetPasswordDto) {
  //   this.authService.resetPasswordRequest(dto);

  //   return 'Reset password request sent, please check your email for next steps';
  // }

  // @ApiOperation({ summary: APISummaries.UNAUTH })
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: String })
  // @Post('reset-password')
  // resetPassword(@Body() dto: ResetPasswordDto) {
  //   this.authService.resetPassword(dto);

  //   return 'Password reset successfully';
  // }
}
