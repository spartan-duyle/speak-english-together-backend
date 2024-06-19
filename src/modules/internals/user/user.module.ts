import { Module } from '@nestjs/common';
import UserService from './user.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { UserController } from './user.controller';
import UserRepository from '@/modules/internals/user/user.repository';
import FollowerRepository from '@/modules/internals/follower/follower.repository';
import { CometchatModule } from '@/modules/externals/cometchat/cometchat.module';

@Module({
  imports: [ConfigModule, PrismaModule, CometchatModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, FollowerRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
