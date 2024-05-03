import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UserPayload } from 'src/authentication/types/user.payload';
import CreateRoomDto from './dto/createRoom.dto';
import { PrismaService } from 'src/prisma/prisma.serivce';

@Injectable()
export class RoomService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismService: PrismaService,
  ) {}

  private readonly videoSDKAPIUrl = this.configService.get(
    'videosdk.apiEndpoint',
  );
  private readonly apiKey = this.configService.get('videosdk.apiKey');
  private readonly secretKey = this.configService.get('videosdk.secretKey');

  async generateVideoSDKToken() {
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

    return { token };
  }

  async createRoom(user: UserPayload, data: CreateRoomDto) {
    const url = `${this.videoSDKAPIUrl}/rooms`;
    try {
      const room = await this.prismService.room.create({
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

      const videoSDKRoom = await fetch(url, options);
      const result = await videoSDKRoom.json();
      return { room, videoSDKRoomId: result.roomId };
    } catch (error) {
      console.error('error', error);
      throw new InternalServerErrorException();
    }
  }
}
