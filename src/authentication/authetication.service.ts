import * as bcrypt from 'bcrypt';
import RegisterDto from './dto/register.dto';
import { UserNotFoundException } from 'src/user/exceptions/userNotFound.exception';
import { UserStatus } from 'src/user/enum/userStatus.enum';
import { PrismaService } from 'src/prisma/prisma.serivce';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { pick } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from 'src/helpers/helpers';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import UserService from 'src/user/user.service';
import { UserModel } from 'src/user/model/user.model';

@Injectable()
export default class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly userService: UserService,
  ) {}

  private readonly jwtSecret = this.config.get('auth.jwtSecret');
  private readonly jwtExpiresIn = `${this.config.get('auth.jwtExpiration')}s`;
  private readonly jwtVerificationTokenSecret = this.config.get(
    'mail.jwtVerificationSecret',
  );

  public async registerUser(registrationData: RegisterDto) {
    const user = await this.userService.getByEmail(
      registrationData.email.toLowerCase(),
    );

    if (user) {
      throw new BadRequestException(ErrorMessages.USER.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const createdUser = await this.prismaService.user.create({
      data: {
        ...registrationData,
        email: registrationData.email.toLowerCase(),
        password: hashedPassword,
      },
    });
    createdUser.password = undefined;
    return createdUser;
  }

  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new UserNotFoundException();
      }
      if (user.status === UserStatus.UNVERIFIED) {
        throw new Error('User not verified');
      }

      await this.verifyPassword(hashedPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getByEmail(dto.email.toLowerCase());

    if (!user)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);
    /*
      if the user was deleted
     */
    if (user.deleted_at || user.status === UserStatus.UNVERIFIED)
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
      throw new BadRequestException('Email already confirmed');
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
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
