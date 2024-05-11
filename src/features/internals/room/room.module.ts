import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/database/prisma/prisma.serivce';
import { JwtService } from '@nestjs/jwt';
import { RoomMemberModule } from '../roomMember/roomMember.module';
import { FirebaseModule } from '../../externals/firebase/firebase.module';
import { VideoSDKModule } from '../../externals/videoSDK/videoSDK.module';
import RoomRepository from '@/features/internals/room/room.repository';
import { TopicModule } from '@/features/internals/topic/topic.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, JwtService, RoomRepository],
  exports: [RoomService],
  imports: [RoomMemberModule, FirebaseModule, VideoSDKModule, TopicModule],
})
export class RoomModule {}
