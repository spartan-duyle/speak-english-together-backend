import * as bcrypt from 'bcrypt';
import RegisterDto from './dto/register.dto';
import { UserStatus } from '@/common/enum/userStatus.enum';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { pick } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import UserService from '@/modules/internals/user/user.service';
import { UserModel } from '@/modules/internals/user/model/user.model';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import UserRepository from '@/modules/internals/user/user.repository';
import CometchatService from '@/modules/externals/cometchat/cometchat.service';

@Injectable()
export default class AuthenticationService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private readonly userService: UserService,
    private readonly userRepo: UserRepository,
    private readonly cometchatService: CometchatService,
  ) {}

  private readonly jwtSecret = this.config.get('auth.jwtSecret');
  private readonly jwtExpiresIn = `${this.config.get('auth.jwtExpiration')}s`;
  private readonly jwtVerificationTokenSecret = this.config.get(
    'mail.jwtVerificationSecret',
  );

  public async registerUser(registrationData: RegisterDto) {
    const user = await this.userRepo.byEmail(
      registrationData.email.toLowerCase(),
    );

    if (user) {
      throw new BadRequestException(ErrorMessages.USER.EMAIL_ALREADY_EXISTS);
    }

    registrationData.password = await bcrypt.hash(
      registrationData.password,
      10,
    );

    const cometChatUser = await this.cometchatService.createUser(
      Date.now().toString(),
      registrationData.full_name,
    );

    const createdUser = await this.userService.create(
      registrationData,
      cometChatUser.data.uid,
    );
    createdUser.password = undefined;

    return createdUser;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getByEmail(dto.email.toLowerCase());

    if (!user)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);
    /*
      if the user was deleted
     */
    if (user.status === UserStatus.UNVERIFIED)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);

    if (user.status === UserStatus.INACTIVE)
      throw new ForbiddenException(ErrorMessages.AUTH.USER_INACTIVE);

    await this.verifyPassword(dto.password, user.password);

    return this.signToken(user);
  }

  async refreshToken(dto: RefreshTokenDto) {
    const payload = await this.jwt.verify(dto.refreshToken, {
      secret: this.jwtSecret,
    });

    delete payload.iat;
    delete payload.exp;

    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: this.jwtExpiresIn,
      secret: this.jwtSecret,
    });

    return {
      accessToken: accessToken,
    };
  }

  async verify(email: string) {
    const emailLowerCase = email.toLowerCase();
    const user = await this.userService.getByEmail(emailLowerCase);

    if (user.status !== UserStatus.UNVERIFIED) {
      throw new BadRequestException(ErrorMessages.USER.EMAIL_ALREADY_CONFIRMED);
    }
    await this.userService.markEmailAsConfirmed(emailLowerCase);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwt.verify(token, {
        secret: this.jwtVerificationTokenSecret,
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);
    }
  }

  async signToken(
    user: UserModel,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserModel }> {
    const pickedFields: string[] = [
      'id',
      'email',
      'fullName',
      'role',
      'level',
      'nationality',
    ];
    const payload = pick(user, pickedFields);

    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: this.jwtExpiresIn,
      secret: this.jwtSecret,
    });

    const refreshToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.jwtSecret,
    });

    user.password = undefined;

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    };
  }
}
