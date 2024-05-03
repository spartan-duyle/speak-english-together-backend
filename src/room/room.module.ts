import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/prisma/prisma.serivce';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, JwtService],
  exports: [RoomService],
})
export class RoomModule {}
