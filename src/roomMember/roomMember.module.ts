import { Module } from '@nestjs/common';
import { RoomMemberService } from './roomMember.service';
import { PrismaService } from '../prisma/prisma.serivce';

@Module({
  imports: [],
  controllers: [],
  providers: [RoomMemberService, PrismaService],
  exports: [RoomMemberService],
})
export class RoomMemberModule {}
