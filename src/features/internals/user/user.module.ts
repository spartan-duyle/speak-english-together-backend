import { Module } from '@nestjs/common';
import UserService from './user.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { UserController } from './user.controller';
import UserRepository from '@/features/internals/user/user.repository';
import FollowerRepository from '@/features/internals/follower/follower.repository';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, FollowerRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
