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
import { FirestoreService } from '../../externals/firebase/firestore.service';
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
import { OpenaiService } from '@/modules/internals/openai/openai.service';
import { AddFirestoreRoomDto } from '@/modules/externals/firebase/dto/addFirestoreRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomMemberService: RoomMemberService,
    private readonly firestoreService: FirestoreService,
    private readonly videoSDKService: VideoSDKService,
    private readonly roomRepository: RoomRepository,
    private readonly topicService: TopicService,
    private readonly prisma: PrismaService,
    private readonly openaiService: OpenaiService,
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

        const addRoomData: AddFirestoreRoomDto = {
          roomId: room.id.toString(),
          name: data.name,
        };

        await this.firestoreService.addFirestoreRoom(addRoomData);

        const roomMember = await this.roomMemberService.findFirstMemberInRoom(
          room.id,
        );

        const addFirestoreRoomMemberData: AddFirestoreRoomMemberDto = {
          roomId: room.id.toString(),
          fullName: user.full_name,
          avatarUrl: user.avatar_url,
          userId: user.id,
          isHost: true,
        };

        await this.firestoreService.addFirestoreRoomMember(
          roomMember.id.toString(),
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

        const existingRoomMember =
          await this.roomMemberService.byRoomIdAndUserId(
            existingActiveRoom.id,
            user.id,
          );

        if (existingRoomMember) {
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

        const newMemberAmount = existingActiveRoom.current_member_amount + 1;

        await this.roomRepository.updateCurrentMemberAmount(
          existingActiveRoom.id,
          newMemberAmount,
        );

        const roomMember = await this.roomMemberService.addRoomMember({
          userId: user.id,
          roomId: existingActiveRoom.id,
          isHost: false,
          avatarUrl: user.avatar_url,
          fullName: user.full_name,
          isMuted: false,
        });

        await this.firestoreService.updateCurrentMemberAmountInRoom(
          existingActiveRoom.id.toString(),
          newMemberAmount,
        );

        const addFirestoreRoomMemberData: AddFirestoreRoomMemberDto = {
          roomId: existingActiveRoom.id.toString(),
          fullName: user.full_name,
          avatarUrl: user.avatar_url,
          userId: user.id,
          isHost: false,
        };

        // sync room members to firestore
        await this.firestoreService.addFirestoreRoomMember(
          roomMember.id.toString(),
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

        if (existingActiveRoom.current_member_amount === 1) {
          await this.roomRepository.endRoom(existingActiveRoom.id);
          await this.firestoreService.deleteFireStoreRoom(
            existingActiveRoom.id.toString(),
          );

          // deactivate video sdk room
          await this.videoSDKService.deactivateRoom(
            existingActiveRoom.video_sdk_room_id,
            request.videoSDKToken,
          );

          await this.roomMemberService.removeRoomMember(roomMember.id);
          await this.firestoreService.deleteFirestoreRoomMember(
            existingActiveRoom.id.toString(),
            user.id,
          );

          // end videoSDK sessions
          await this.videoSDKService.endSession(
            existingActiveRoom.video_sdk_room_id,
            request.videoSDKToken,
          );
        } else {
          await this.roomMemberService.removeRoomMember(roomMember.id);
          await this.firestoreService.deleteFirestoreRoomMember(
            existingActiveRoom.id.toString(),
            user.id,
          );

          const nextHostRoomMember =
            await this.roomMemberService.updateToNewHostMemberInRoom(
              existingActiveRoom.id,
            );

          await this.roomRepository.updateCurrentMemberAmountAndHostUser(
            existingActiveRoom.id,
            existingActiveRoom.current_member_amount - 1,
            nextHostRoomMember.user_id,
          );

          await this.firestoreService.updateCurrentMemberAmountInRoom(
            existingActiveRoom.id.toString(),
            existingActiveRoom.current_member_amount - 1,
          );

          await this.firestoreService.updateRoomMemberToHost(
            nextHostRoomMember.id.toString(),
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

  async generateSpeakingSentence(
    user: UserPayload,
    roomId: number,
    refresh: boolean,
  ) {
    const room = await this.roomRepository.byId(roomId);
    if (!room) {
      throw new NotFoundException(ErrorMessages.ROOM.NOT_FOUND);
    }

    return await this.openaiService.generateSentenceInRoom(
      user,
      room.topic.name,
      refresh,
    );
  }
}
