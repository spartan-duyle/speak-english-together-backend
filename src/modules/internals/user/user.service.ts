import { plainToInstanceCustom } from 'src/common/helpers/helpers';
import { UserModel } from './model/user.model';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import * as bcrypt from 'bcrypt';
import UserRepository from '@/modules/internals/user/user.repository';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import ListUserResponse from '@/modules/internals/user/response/listUser.response';
import UserResponse from '@/modules/internals/user/response/userResponse';
import FollowerRepository from '@/modules/internals/follower/follower.repository';
import RegisterDto from '@/authentication/dto/register.dto';

@Injectable()
export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followerRepository: FollowerRepository,
  ) {}

  async getByEmail(email: string): Promise<UserModel> {
    const user = await this.userRepository.byEmail(email);
    if (!user) {
      throw new NotFoundException(ErrorMessages.USER.USER_NOT_FOUND);
    }
    return plainToInstanceCustom(UserModel, user);
  }

  async markEmailAsConfirmed(email: string) {
    return await this.userRepository.markEmailAsConfirmed(email);
  }

  async userProfile(id: number): Promise<UserResponse> {
    const user = await this.userRepository.byId(id);

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER.USER_NOT_FOUND);
    }

    const countFollowers = await this.followerRepository.countFollowers(id);
    const countFollowing = await this.followerRepository.countFollowing(id);

    const result = plainToInstanceCustom(UserResponse, user);
    result.count_followers = countFollowers;
    result.count_following = countFollowing;
    return result;
  }

  async updateUserProfile(
    id: number,
    data: UpdateUserDto,
  ): Promise<UserResponse> {
    const existingUser = await this.userRepository.byId(id);

    if (!existingUser) {
      throw new NotFoundException(ErrorMessages.USER.USER_NOT_FOUND);
    }

    if (data.birthday) {
      data.birthday = new Date(data.birthday);
      data.birthday.setUTCHours(0, 0, 0, 0);
    }

    const updatedUser = await this.userRepository.updateProfile(
      id,
      data.full_name,
      data.description,
      data.avatar_url,
      data.level,
      data.nationality,
      data.birthday,
      data.native_language,
      data.interests,
      data.learning_goals,
      data.occupation,
    );


    return plainToInstanceCustom(UserResponse, updatedUser);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    const existingUser = await this.userRepository.byId(id);

    if (!existingUser) {
      throw new NotFoundException(ErrorMessages.USER.USER_NOT_FOUND);
    }

    const isCurrentPasswordMatching = await bcrypt.compare(
      data.current_password,
      existingUser.password,
    );

    if (!isCurrentPasswordMatching) {
      throw new BadRequestException(
        ErrorMessages.USER.CURRENT_PASSWORD_INCORRECT,
      );
    }

    if (data.new_password === data.current_password) {
      throw new BadRequestException(ErrorMessages.USER.PASSWORD_SAME);
    }

    if (data.new_password !== data.confirm_password) {
      throw new BadRequestException(ErrorMessages.USER.PASSWORD_MISMATCH);
    }

    const hashedPassword = await bcrypt.hash(data.new_password, 10);

    await this.userRepository.updatePassword(id, hashedPassword);
  }

  async create(data: RegisterDto, cometChatId: string) {
    return await this.userRepository.create(data, cometChatId);
  }

  async listUsers(
    currentUserId: number,
    page: number,
    perPage: number,
    search: string,
  ): Promise<ListUserResponse> {
    const { data: users, total } = await this.userRepository.getUsers(
      currentUserId,
      page || 1,
      perPage || 10,
      search,
    );

    const followingOfCurrentUser =
      await this.followerRepository.byFollowerId(currentUserId);

    const data = await Promise.all(
      users.map(async (user) => {
        const isFollowing = followingOfCurrentUser.some(
          (following) => following.followed_id === user.id,
        );
        const result = plainToInstanceCustom(UserResponse, user);
        const countFollowers = await this.followerRepository.countFollowers(
          user.id,
        );
        const countFollowing = await this.followerRepository.countFollowing(
          user.id,
        );
        result.is_following = isFollowing;
        result.count_followers = countFollowers;
        result.count_following = countFollowing;
        return result;
      }),
    );

    return {
      data: data,
      total,
    };
  }

  async userDetail(
    currentUserId: number,
    ofUserId: number,
  ): Promise<UserResponse> {
    const user = await this.userRepository.byId(ofUserId);

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER.USER_NOT_FOUND);
    }

    const followingOfCurrentUser =
      await this.followerRepository.byFollowerId(currentUserId);

    const countFollowers =
      await this.followerRepository.countFollowers(ofUserId);
    const countFollowing =
      await this.followerRepository.countFollowing(ofUserId);

    const result = plainToInstanceCustom(UserResponse, user);

    result.count_followers = countFollowers;
    result.count_following = countFollowing;
    result.is_following = followingOfCurrentUser.some(
      (following) => following.followed_id === user.id,
    );
    return result;
  }

  async migrateCometChatUid() {
    const users = await this.userRepository.getAll();

    users.map(
      (user) => this.co
    )
  }
}
