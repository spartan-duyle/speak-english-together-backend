export default class CreateRoomDto {
  name: string;
  topicId: number;
  isPrivate: boolean = false;
  password: string = null;
  description: string = null;
  thumbnail: string = null;
  maxMemberAmount: number;
  videoSDKToken: string;
}
