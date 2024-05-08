import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
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
import { PaginatedOutputResponse } from '../utils/pagination/paginatedOutputResponse';
import { RoomResponse } from './response/room.response';
import { RoomMemberDto } from '../roomMember/dto/roomMember.dto';
import { ListRoomResponse } from "./response/listRoom.response";

@Injectable()
export class RoomService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly roomMemberService: RoomMemberService,
    private readonly firestoreRoomMemberService: FirestoreRoomMemberService,
  ) {}

  private readonly videoSDKAPIUrl = this.configService.get(
    'videoSDK.apiEndpoint',
  );
  private readonly apiKey = this.configService.get('videoSDK.apiKey');
  private readonly secretKey = this.configService.get('videoSDK.secretKey');

  async generateVideoSDKToken(): Promise<VideoSDKTokenResponse> {
    const options: jwt.SignOptions = {
      expiresIn: '120m',
      algorithm: 'HS256',
    };
    const payload = {
      apikey: this.apiKey,
      permissions: [`allow_join`], // `ask_join` || `allow_mod`
      version: 2, //OPTIONAL
    };

    const token = jwt.sign(payload, this.secretKey, options);

    return plainToInstanceCustom(VideoSDKTokenResponse, { token });
  }

  async createRoom(
    user: UserPayload,
    data: CreateRoomDto,
  ): Promise<CreateRoomResponse> {
    const createVideoSDKRoomUrl = `${this.videoSDKAPIUrl}/rooms`;

    if (data.isPrivate && !data.password) {
      throw new BadRequestException('Password is required for private rooms');
    }

    if (data.topicId !== undefined && data.topicId !== null) {
      const topic = await this.prismaService.topic.findUnique({
        where: { id: data.topicId },
      });

      if (!topic) {
        throw new NotFoundException('Topic not found');
      }
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: data.videoSDKToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customRoomId: data.name }),
      };

      const videoSDKRoomResponse = await fetch(createVideoSDKRoomUrl, options);
      const videoSDKRoom = await videoSDKRoomResponse.json();

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
          video_sdk_room_id: videoSDKRoom.roomId,
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
        video_sdk_room_id: videoSDKRoom.roomId,
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
      name: {
        contains: search,
      },
      ...(topicId && { topic_id: parseInt(String(topicId)) || null }),
    };

    const rooms = await this.prismaService.room.findMany({
      where: whereClause,
      include: {
        room_members: {
          where: {
            left_at: null,
          },
        },
        topic: true,
      },
      take: perPage,
      skip: (page - 1) * perPage,
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
}
