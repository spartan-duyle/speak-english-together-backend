import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import FollowerRepository from '@/features/internals/follower/follower.repository';
import { FollowerController } from '@/features/internals/follower/follower.controller';
import UserRepository from '@/features/internals/user/user.repository';
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
