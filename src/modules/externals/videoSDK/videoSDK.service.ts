import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class VideoSDKService {
  constructor(private readonly configService: ConfigService) {}

  private readonly videoSDKAPIUrl = this.configService.get(
    'videoSDK.apiEndpoint',
  );

  private readonly apiKey = this.configService.get('videoSDK.apiKey');
  private readonly secretKey = this.configService.get('videoSDK.secretKey');

  async generateAccessToken(): Promise<string> {
    const options: jwt.SignOptions = {
      expiresIn: '120m',
      algorithm: 'HS256',
    };
    const payload = {
      apikey: this.apiKey,
      permissions: ['allow_join', 'allow_mod'], // `ask_join` || `allow_mod`
      version: 2, //OPTIONAL
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  async createRoom(videoSDKToken: string): Promise<string> {
    try {
      const createVideoSDKRoomUrl = `${this.videoSDKAPIUrl}/rooms`;

      const options = {
        method: 'POST',
        headers: {
          Authorization: videoSDKToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      };

      const videoSDKRoomResponse = await fetch(createVideoSDKRoomUrl, options);
      const videoSDKRoom = await videoSDKRoomResponse.json();
      return videoSDKRoom.roomId;
    } catch (ex) {
      throw new InternalServerErrorException('Create room failed');
    }
  }

  async validateRoom(roomId: string, videoSDKToken: string): Promise<boolean> {
    try {
      const validateRoomUrl = `${this.videoSDKAPIUrl}/rooms/${roomId}`;

      const options = {
        method: 'GET',
        headers: {
          Authorization: videoSDKToken,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(validateRoomUrl, options);
      const data = await response.json();
      return data.roomId === roomId;
    } catch (ex) {
      throw new InternalServerErrorException('Something went wrongs');
    }
  }

  async deactivateRoom(roomId: string, videoSDKToken: string) {
    try {
      const deactivateRoomUrl = `${this.videoSDKAPIUrl}/rooms/deactivate`;

      const options = {
        method: 'POST',
        headers: {
          Authorization: videoSDKToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId,
        }),
      };

      await fetch(deactivateRoomUrl, options);
    } catch (ex) {
      throw new InternalServerErrorException('Something went wrongs');
    }
  }

  async endSession(roomId: string, videoSDKToken: string) {
    try {
      const sessionUrl = `${this.videoSDKAPIUrl}/sessions/end`;

      const options = {
        method: 'POST',
        headers: {
          Authorization: videoSDKToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId,
        }),
      };

      const response = await fetch(sessionUrl, options);
      return await response.json();
    } catch (ex) {
      throw new InternalServerErrorException('Something went wrongs');
    }
  }
}
