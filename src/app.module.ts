import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from '@hapi/joi'; // Import Joi from '@hapi/joi'
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './mail/mail.module';
import { RoomModule } from './room/room.module';
import { TopicModule } from './topic/topic.module';
import AppConfig from './config/config';

@Module({
  imports: [
    PostModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
