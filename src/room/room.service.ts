import {
  BadRequestException,
  Injectable,
  InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UserPayload } from 'src/authentication/types/user.payload';
import CreateRoomDto from './dto/createRoom.dto';
import { PrismaService } from 'src/prisma/prisma.serivce';
import VideoSDKTokenResponse from './response/videoSDKToken.response';
import { plainToInstance } from 'class-transformer';
import { plainToInstanceCustom } from '../helpers/helpers';
import CreateRoomResponse from './response/createRoom.response';

@Injectable()
export class RoomService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly videoSDKAPIUrl = this.configService.get(
    'videosdk.apiEndpoint',
  );
  private readonly apiKey = this.configService.get('videosdk.apiKey');
  private readonly secretKey = this.configService.get('videosdk.secretKey');

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
        },
      });

      const options = {
        method: 'POST',
        headers: {
          Authorization: data.videoSDKToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customRoomId: room.name }),
      };

      const videoSDKRoomResponse = await fetch(createVideoSDKRoomUrl, options);
      const videoSDKRoom = await videoSDKRoomResponse.json();
      return plainToInstanceCustom(CreateRoomResponse, {
        ...room,
        videoSDKRoomId: videoSDKRoom.roomId,
      });
    } catch (error) {
      console.error('error', error);
      throw new InternalServerErrorException();
    }
  }
}
