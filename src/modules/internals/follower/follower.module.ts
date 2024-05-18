import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import FollowerRepository from '@/modules/internals/follower/follower.repository';
import { FollowerController } from '@/modules/internals/follower/follower.controller';
import UserRepository from '@/modules/internals/user/user.repository';
import { PrismaService } from '@/database/prisma/prisma.serivce';

@Module({
  providers: [
    FollowerService,
    FollowerRepository,
    UserRepository,
    PrismaService,
  ],
  exports: [FollowerService],
  controllers: [FollowerController],
})
export class FollowerModule {}
