import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import AuthenticationService from './authetication.service';
import { APISummaries } from 'src/helpers/helpers';
import { AuthModel } from './model/auth.model';
import RegisterDto from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';

// type UserType = Pick<user, 'role' | 'id' | 'username' | 'email'>;

@Controller('auth')
@ApiTags('AUTH')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly mailService: MailService,
  ) {}

  @ApiOperation({ summary: APISummaries.UNAUTH })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: AuthModel })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const response = await this.authService.registerUser(dto);
    await this.mailService.sendEmailConfirmation({
      email: dto.email,
      name: dto.full_name,
    });
    return response;
  }

  // @ApiOperation({ summary: APISummaries.UNAUTH })
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: AuthModel })
  // @Post('login')
  // login(@Body() dto: LoginDto) {
  //   return this.authService.login(dto);
  // }

  // @ApiOperation({ summary: APISummaries.UNAUTH })
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: AuthModel })
  // @Post('refresh')
  // refreshToken(@Body() dto: RefreshTokenDto) {
  //   return this.authService.refreshToken(dto);
  // }

  // @ApiOperation({ summary: APISummaries.USER })
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: String })
  // @ApiBearerAuth()
  // @UseGuards(UserGuard)
  // @Get('verify')
  // verify(@Query() query: VerifyUserDto, @GetUser() user: UserType) {
  //   return this.authService.verify(query, {
  //     email: user.email,
  //     username: user.username,
  //   });
  // }

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
