import { Module } from '@nestjs/common';
import { RoomMemberService } from './roomMember.service';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import RoomMemberRepository from '@/features/internals/roomMember/roomMember.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [RoomMemberService, PrismaService, RoomMemberRepository],
  exports: [RoomMemberService],
})
export class RoomMemberModule {}
