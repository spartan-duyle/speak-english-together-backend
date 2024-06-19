import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class CometchatService {
  constructor(private readonly configService: ConfigService) {}
  private readonly appId = this.configService.get('cometChat.appId');
  private readonly apiKey = this.configService.get('cometChat.apiKey');
  private readonly url = `https://${this.appId}.api-us.cometchat.io/v3/users`;

  async createUser(uid: string, name: string, avatar?: string) {
    const options = avatar
      ? {
          method: 'POST',
          headers: {
            apiKey: this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
            name: name,
            avatar: avatar,
          }),
        }
      : {
          method: 'POST',
          headers: {
            apiKey: this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
            name: name,
          }),
        };

    try {
      const response = await fetch(this.url, options);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
}
