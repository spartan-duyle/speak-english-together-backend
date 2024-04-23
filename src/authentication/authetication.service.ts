import * as bcrypt from 'bcrypt';
import RegisterDto from './dto/register.dto';
import WrongCredentialException from './exceptions/wrongCredential.exception';
import { UserNotFoundException } from 'src/user/exceptions/userNotFound.exception';
import { UserStatus } from 'src/user/enum/userStatus.enum';
import { PrismaService } from 'src/prisma/prisma.serivce';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { pick } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from 'src/helpers/helpers';

@Injectable()
export default class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private readonly jwtSecret = this.config.get('auth.jwtSecret');
  private readonly jwtExpiresIn = `${this.config.get('auth.jwtExpiration')}s`;

  public async registerUser(registrationData: RegisterDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: registrationData.email },
    });

    if (user) {
      throw new BadRequestException(ErrorMessages.USER.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const createdUser = await this.prismaService.user.create({
      data: {
        ...registrationData,
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
      throw new WrongCredentialException();
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
      throw new WrongCredentialException();
    }
  }

  async signToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const pickedFields: string[] = [
      'id',
      'email',
      'full_name',
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
