import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from '@hapi/joi'; // Import Joi from '@hapi/joi'
import { PrismaModule } from './database/prisma/prisma.module';
import { UserModule } from './features/internals/user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './shared/mail/mail.module';
import { RoomModule } from './features/internals/room/room.module';
import { TopicModule } from './features/internals/topic/topic.module';
import { FirebaseModule } from './features/externals/firebase/firebase.module';
import { FileModule } from './features/internals/file/file.module';
import { RoomMemberModule } from './features/internals/roomMember/roomMember.module';
import { VideoSDKModule } from './features/externals/videoSDK/videoSDK.module';
import AppConfig from './config/config';
import { FollowerModule } from '@/features/internals/follower/follower.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
      isGlobal: true,
      load: [AppConfig],
    }),
    PrismaModule,
    UserModule,
    AuthenticationModule,
    MailModule,
    RoomModule,
    TopicModule,
    FileModule,
    RoomMemberModule,
    VideoSDKModule,
    FollowerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
