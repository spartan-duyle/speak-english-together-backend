import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from '@hapi/joi';
import { PrismaModule } from './database/prisma/prisma.module';
import { UserModule } from '@/modules/internals/user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './shared/mail/mail.module';
import { RoomModule } from '@/modules/internals/room/room.module';
import { TopicModule } from '@/modules/internals/topic/topic.module';
import { FirebaseModule } from '@/modules/externals/firebase/firebase.module';
import { FileModule } from '@/modules/internals/file/file.module';
import { RoomMemberModule } from '@/modules/internals/roomMember/roomMember.module';
import { VideoSDKModule } from '@/modules/externals/videoSDK/videoSDK.module';
import AppConfig from './config/config';
import { FollowerModule } from '@/modules/internals/follower/follower.module';
import { GoogleTranslateModule } from '@/modules/externals/google-translate/google-translate.module';
import { TranslateModule } from '@/modules/internals/translate/translate.module';
import { RedisCacheModule } from './redis/redisCacheModule';
import { OpenaiModule } from '@/modules/externals/openai/openai.module';
import { OpenaiService } from './modules/externals/openai/openai.service';
import { CacheModule } from '@nestjs/cache-manager';
import { VocabularyModule } from '@/modules/internals/vocabulary/vocabulary.module';
import { redisStore } from 'cache-manager-redis-yet';
import { GoogleSpeechModule } from './google-speech/google-speech.module';
import { CollectionModule } from '@/modules/internals/collection/collection.module';

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
    FirebaseModule,
    GoogleTranslateModule,
    TranslateModule,
    RedisCacheModule,
    OpenaiModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config) => {
        const store = await redisStore({
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
          },
        });
        return { store };
      },
      inject: [ConfigService],
    }),
    VocabularyModule,
    GoogleSpeechModule,
    CollectionModule,
  ],
  controllers: [],
  providers: [OpenaiService],
})
export class AppModule {}
