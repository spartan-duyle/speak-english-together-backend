import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserPayload } from 'src/authentication/types/user.payload';
import CreateRoomDto from './dto/createRoom.dto';
import VideoSDKTokenResponse from './response/videoSDKToken.response';
import { plainToInstanceCustom } from '@/common/helpers/helpers';
import CreateRoomResponse from './response/createRoom.response';
import { RoomMemberService } from '../roomMember/roomMember.service';
import { FirestoreRoomMemberService } from '../../externals/firebase/firestoreRoomMember.service';
import { AddFirestoreRoomMemberDto } from '../../externals/firebase/dto/addFirestoreRoomMember.dto';
import { RoomResponse } from './response/room.response';
import { RoomMemberDto } from '../roomMember/dto/roomMember.dto';
import { ListRoomResponse } from './response/listRoom.response';
import { JoinRoomDto } from './dto/joinRoom.dto';
import { VideoSDKService } from '../../externals/videoSDK/videoSDK.service';
import RoomRepository from '@/modules/internals/room/room.repository';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import { TopicService } from '@/modules/internals/topic/topic.service';
import { TopicDto } from '@/modules/internals/topic/dto/topic.dto';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import LeaveRoomDto from '@/modules/internals/room/dto/leaveRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomMemberService: RoomMemberService,
    private readonly firestoreRoomMemberService: FirestoreRoomMemberService,
    private readonly videoSDKService: VideoSDKService,
    private readonly roomRepository: RoomRepository,
    private readonly topicService: TopicService,
    private readonly prisma: PrismaService,
  ) {}

  async generateVideoSDKToken(): Promise<VideoSDKTokenResponse> {
    const token = await this.videoSDKService.generateAccessToken();

    return plainToInstanceCustom(VideoSDKTokenResponse, { token });
  }

  async createRoom(
    user: UserPayload,
    data: CreateRoomDto,
  ): Promise<CreateRoomResponse> {
    try {
      return await this.prisma.$transaction(async () => {
        if (data.isPrivate && !data.password) {
          throw new BadRequestException(
            'Password is required for private rooms',
          );
        }

        if (data.topicId) {
          await this.topicService.getTopicById(data.topicId);
        }

        const videoSDKRoomId = await this.videoSDKService.createRoom(
          data.videoSDKToken,
        );

        console.log(videoSDKRoomId);

        const isUserJoiningAnotherRoom =
          await this.roomMemberService.isUserJoiningAnotherRoom(user.id);

        if (isUserJoiningAnotherRoom) {
          throw new ConflictException('User is joining another room');
        }

        const room = await this.roomRepository.create(
          data,
          user,
          videoSDKRoomId,
        );

        const addFirestoreRoomMemberData: AddFirestoreRoomMemberDto = {
          roomId: room.id,
          fullName: user.full_name,
          avatarUrl: user.avatar_url,
          userId: user.id,
          isHost: true,
        };

        await this.firestoreRoomMemberService.addFirestoreRoomMember(
          addFirestoreRoomMemberData,
        );

        return plainToInstanceCustom(CreateRoomResponse, room);
      });
    } catch (error: any) {
      throw error;
    }
  }

  async listActiveRooms(
    page: number,
    perPage: number,
    search: string,
    topicId: number,
  ): Promise<ListRoomResponse> {
    const { data: rooms, total } = await this.roomRepository.getActiveRooms(
      page || 1,
      perPage || 10,
      search,
      topicId,
    );

    const mappedRooms = rooms.map((room) => {
      const roomResponse = plainToInstanceCustom(RoomResponse, room);
      roomResponse.topic = plainToInstanceCustom(TopicDto, room.topic);

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

  async joinRoom(
    user: UserPayload,
    roomId: number,
    request: JoinRoomDto,
  ): Promise<void> {
    try {
      return await this.prisma.$transaction(async () => {
        const existingActiveRoom = await this.roomRepository.byId(roomId);

        if (!existingActiveRoom) {
          throw new NotFoundException(ErrorMessages.ROOM.NOT_FOUND);
        }

        if (existingActiveRoom.is_private) {
          if (!request.password) {
            throw new BadRequestException(
              ErrorMessages.ROOM.PASSWORD_IS_REQUIRED,
            );
          } else if (request.password !== existingActiveRoom.password) {
            throw new BadRequestException(
              ErrorMessages.ROOM.INCORRECT_PASSWORD,
            );
          }
        }

        if (
          existingActiveRoom.current_member_amount >=
          existingActiveRoom.max_member_amount
        ) {
          throw new BadRequestException(ErrorMessages.ROOM.FULL_ROOM);
        }

        const roomMember = await this.roomMemberService.byRoomIdAndUserId(
          existingActiveRoom.id,
          user.id,
        );

        if (roomMember) {
          throw new ConflictException(ErrorMessages.ROOM.USER_ALREADY_IN_ROOM);
        }

        const isUserJoiningAnotherRoom =
          await this.roomMemberService.isUserJoiningAnotherRoom(user.id);

        if (isUserJoiningAnotherRoom) {
          throw new ConflictException(
            ErrorMessages.ROOM.USER_IS_JOINING_ANOTHER_ROOM,
          );
        }

        // validate videSDK room
        const isVideoSDKRoomValid = this.videoSDKService.validateRoom(
          existingActiveRoom.video_sdk_room_id,
          request.videoSDKToken,
        );

        if (!isVideoSDKRoomValid) {
          throw new BadRequestException(ErrorMessages.ROOM.CAN_NOT_JOIN_ROOM);
        }

        await this.roomRepository.updateCurrentMemberAmount(
          existingActiveRoom.id,
          existingActiveRoom.current_member_amount + 1,
        );

        await this.roomMemberService.addRoomMember({
          userId: user.id,
          roomId: existingActiveRoom.id,
          isHost: false,
          avatarUrl: user.avatar_url,
          fullName: user.full_name,
          isMuted: false,
        });

        const addFirestoreRoomMemberData: AddFirestoreRoomMemberDto = {
          roomId: existingActiveRoom.id,
          fullName: user.full_name,
          avatarUrl: user.avatar_url,
          userId: user.id,
          isHost: false,
        };

        // sync room members to firestore
        await this.firestoreRoomMemberService.addFirestoreRoomMember(
          addFirestoreRoomMemberData,
        );
      });
    } catch (error: any) {
      throw error;
    }
  }

  async leaveRoom(user: UserPayload, roomId: number, request: LeaveRoomDto) {
    try {
      return await this.prisma.$transaction(async () => {
        const existingActiveRoom = await this.roomRepository.byId(roomId);

        if (!existingActiveRoom) {
          throw new NotFoundException(ErrorMessages.ROOM.NOT_FOUND);
        }

        const roomMember = await this.roomMemberService.byRoomIdAndUserId(
          existingActiveRoom.id,
          user.id,
        );

        if (!roomMember) {
          throw new NotFoundException(ErrorMessages.ROOM.USER_NOT_IN_ROOM);
        }

        if (roomMember.is_host) {
          // if the user is the host, then the room should be ended
          await this.roomMemberService.removeManyMember(existingActiveRoom.id);
          await this.roomRepository.endRoom(existingActiveRoom.id);
          await this.firestoreRoomMemberService.deleteFirestoreRoomMemberForHost(
            existingActiveRoom.id,
          );

          // deactivate video sdk room
          await this.videoSDKService.deactivateRoom(
            existingActiveRoom.video_sdk_room_id,
            request.videoSDKToken,
          );

          // end videoSDK sessions
          await this.videoSDKService.endSession(
            existingActiveRoom.video_sdk_room_id,
            request.videoSDKToken,
          );
        } else {
          // if the user is not the host, then just remove the user from the room
          // decrement the current_member_amount

          await this.roomMemberService.removeRoomMember(roomMember.id);

          await this.roomRepository.updateCurrentMemberAmount(
            existingActiveRoom.id,
            existingActiveRoom.current_member_amount - 1,
          );

          await this.firestoreRoomMemberService.deleteFirestoreRoomMember(
            existingActiveRoom.id,
            user.id,
          );
        }
      });
    } catch (error: any) {
      throw error;
    }
  }

  async getRoomDetails(id: number) {
    const room = await this.roomRepository.getRoomDetails(id);
    if (!room) {
      throw new NotFoundException(ErrorMessages.ROOM.NOT_FOUND);
    }
    const roomResponse = plainToInstanceCustom(RoomResponse, room);
    roomResponse.topic = plainToInstanceCustom(TopicDto, room.topic);
    roomResponse.room_members = room.room_members.map((member) => {
      return plainToInstanceCustom(RoomMemberDto, member);
    });
    return roomResponse;
  }
}
