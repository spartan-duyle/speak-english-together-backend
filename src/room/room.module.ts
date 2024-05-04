import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/prisma/prisma.serivce';
import { JwtService } from '@nestjs/jwt';
import { RoomMemberModule } from '../roomMember/roomMember.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, JwtService],
  exports: [RoomService],
  imports: [RoomMemberModule],
})
export class RoomModule {}
