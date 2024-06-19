import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserStrategy } from './strategy/jwt.strategy';
import AuthenticationService from './authetication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '@/modules/internals/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { MailModule } from 'src/shared/mail/mail.module';
import { CometchatModule } from '@/modules/externals/cometchat/cometchat.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.jwtSecret'),
        signOptions: {
          expiresIn: `${configService.get('auth.jwtExpiration')}s`,
        },
      }),
    }),
    MailModule,
    CometchatModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserStrategy],
})
export class AuthenticationModule {}
