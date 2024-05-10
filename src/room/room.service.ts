import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from 'src/authentication/types/user.payload';
import CreateRoomDto from './dto/createRoom.dto';
import { PrismaService } from 'src/prisma/prisma.serivce';
import VideoSDKTokenResponse from './response/videoSDKToken.response';
import { plainToInstanceCustom } from '../helpers/helpers';
import CreateRoomResponse from './response/createRoom.response';
import { RoomMemberService } from '../roomMember/roomMember.service';
import { FirestoreRoomMemberService } from '../firebase/firestoreRoomMember.service';
import { AddFirestoreRoomMemberDto } from '../firebase/dto/addFirestoreRoomMember.dto';
import { Prisma } from '@prisma/client';
import { RoomResponse } from './response/room.response';
import { RoomMemberDto } from '../roomMember/dto/roomMember.dto';
import { ListRoomResponse } from './response/listRoom.response';
import { JoinRoomDto } from './dto/joinRoom.dto';
import { VideoSDKService } from '../videoSDK/videoSDK.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly roomMemberService: RoomMemberService,
    private readonly firestoreRoomMemberService: FirestoreRoomMemberService,
    private readonly videoSDKService: VideoSDKService,
  ) {}

  async generateVideoSDKToken(): Promise<VideoSDKTokenResponse> {
    const token = await this.videoSDKService.generateAccessToken();

    return plainToInstanceCustom(VideoSDKTokenResponse, { token });
  }

  async createRoom(
    user: UserPayload,
    data: CreateRoomDto,
  ): Promise<CreateRoomResponse> {
    if (data.isPrivate && !data.password) {
      throw new BadRequestException('Password is required for private rooms');
    }

    if (data.topicId !== undefined && data.topicId !== null) {
      const topic = await this.prismaService.topic.findUnique({
        where: { id: data.topicId, deleted_at: null },
      });

      if (!topic) {
        throw new NotFoundException('Topic not found');
      }
    }

    try {
      const videoSDKRoomId = await this.videoSDKService.createRoom(
        data.videoSDKToken,
      );

      console.log('videoSDKRoomId', videoSDKRoomId);

      const room = await this.prismaService.room.create({
        data: {
          name: data.name,
          host_user_id: user.id,
          topic_id: data.topicId,
          is_private: data.isPrivate,
          description: data.description,
          password: data.password,
          thumbnail: data.thumbnail,
          max_member_amount: data.maxMemberAmount,
          current_member_amount: 1,
          room_members: {
            create: [
              {
                user_id: user.id,
                is_host: true,
                avatar_url: user.avatar_url,
                full_name: user.full_name,
                is_muted: true,
              },
            ],
          },
          video_sdk_room_id: videoSDKRoomId,
        },
      });

      // const addFirestoreRoomMemberData: AddFirestoreRoomMemberDto = {
      //   roomId: room.id,
      //   fullName: user.full_name,
      //   avatarUrl: user.avatar_url,
      //   userId: user.id,
      //   isHost: true,
      //   isMuted: true,
      // };

      // // sync room members to firestore
      // await this.firestoreRoomMemberService.addFirestoreRoomMember(
      //   addFirestoreRoomMemberData,
      // );

      return plainToInstanceCustom(CreateRoomResponse, {
        ...room,
      });
    } catch (error) {
      console.error('error', error);
      throw new InternalServerErrorException();
    }
  }

  async listActiveRooms(
    page: number,
    perPage: number,
    search: string,
    topicId: number,
  ): Promise<ListRoomResponse> {
    const whereClause: Prisma.RoomWhereInput = {
      ended_at: null,
      deleted_at: null,
      name: {
        contains: search,
      },
      ...(topicId && { topic_id: topicId || null }),
    };

    const rooms = await this.prismaService.room.findMany({
      where: whereClause,
      include: {
        room_members: {
          where: {
            left_at: null,
            deleted_at: null,
          },
        },
        topic: {
          where: {
            deleted_at: null,
          },
        },
      },
      take: perPage || 10,
      skip: (page - 1) * perPage || 0,
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await this.prismaService.room.count({
      where: whereClause,
    });

    const mappedRooms = rooms.map((room) => {
      const roomResponse = plainToInstanceCustom(RoomResponse, room);
      roomResponse.topic_name = room.topic ? room.topic.name : null; // map the topic name

      // map the room_members property
      roomResponse.room_members = room.room_members.map((member) => {
        // transform each member into an instance of a class
        // replace MemberClass with the actual class that represents a room member
        return plainToInstanceCustom(RoomMemberDto, member);
      });

      return roomResponse;
    });

    return {
      data: mappedRooms,
      total,
    };
  }

  async joinRoom(user: UserPayload, request: JoinRoomDto): Promise<void> {
    const existingActiveRoom = await this.prismaService.room.findUnique({
      where: {
        video_sdk_room_id: request.videoSDKRoomId,
        ended_at: null,
        deleted_at: null,
      },
    });

    if (!existingActiveRoom) {
      throw new NotFoundException('Room not found');
    }

    if (existingActiveRoom.is_private) {
      if (!request.password) {
        throw new BadRequestException(
          'Password is required for the private room',
        );
      } else if (request.password !== existingActiveRoom.password) {
        throw new BadRequestException('Password is incorrect');
      }
    }

    if (
      existingActiveRoom.current_member_amount >=
      existingActiveRoom.max_member_amount
    ) {
      throw new BadRequestException('Room is full');
    }

    const roomMember = await this.roomMemberService.byRoomIdAndUserId(
      existingActiveRoom.id,
      user.id,
    );

    if (roomMember) {
      throw new ConflictException('User already joined the room');
    }

    // validate videSDK room
    const isVideoSDKRoomValid = this.videoSDKService.validateRoom(
      request.videoSDKRoomId,
      request.videoSDKToken,
    );

    if (!isVideoSDKRoomValid) {
      throw new BadRequestException('Can not join the room');
    }

    await this.prismaService.room.update({
      where: { id: existingActiveRoom.id },
      data: {
        current_member_amount: existingActiveRoom.current_member_amount + 1,
      },
    });

    await this.roomMemberService.addRoomMember({
      userId: user.id,
      roomId: existingActiveRoom.id,
      isHost: false,
      avatarUrl: user.avatar_url,
      fullName: user.full_name,
      isMuted: false,
    });
  }
}
