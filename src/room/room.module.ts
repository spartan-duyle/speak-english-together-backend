import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/prisma/prisma.serivce';
import { JwtService } from '@nestjs/jwt';
import { RoomMemberModule } from '../roomMember/roomMember.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { VideoSDKModule } from '../videoSDK/videoSDK.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, JwtService],
  exports: [RoomService],
  imports: [RoomMemberModule, FirebaseModule, VideoSDKModule],
})
export class RoomModule {}
