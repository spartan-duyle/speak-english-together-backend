import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/database/prisma/prisma.serivce';
import { JwtService } from '@nestjs/jwt';
import { RoomMemberModule } from '../roomMember/roomMember.module';
import { FirebaseModule } from '../../externals/firebase/firebase.module';
import { VideoSDKModule } from '../../externals/videoSDK/videoSDK.module';
import RoomRepository from '@/modules/internals/room/room.repository';
import { TopicModule } from '@/modules/internals/topic/topic.module';
import { OpenaiModule } from '@/modules/internals/openai/openai.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, JwtService, RoomRepository],
  exports: [RoomService],
  imports: [RoomMemberModule, FirebaseModule, VideoSDKModule, TopicModule, OpenaiModule],
})
export class RoomModule {}
