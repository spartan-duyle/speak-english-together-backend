import { plainToInstanceCustom } from 'src/common/helpers/helpers';
import { UserModel } from './model/user.model';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserProfileResponse } from './response/userProfile.response';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import * as bcrypt from 'bcrypt';
import UserRepository from '@/features/internals/user/user.repository';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async userProfile(id: number): Promise<UserProfileResponse> {
    const user = await this.userRepository.byId(id);
    if (!user) {
      throw new NotFoundException(ErrorMessages.USER.USER_NOT_FOUND);
    }
    return plainToInstanceCustom(UserProfileResponse, user);
  }

  async updateUserProfile(
    id: number,
    data: UpdateUserDto,
  ): Promise<UserProfileResponse> {
    const existingUser = await this.userRepository.byId(id);

    if (!existingUser) {
      throw new NotFoundException(ErrorMessages.USER.USER_NOT_FOUND);
    }

    const updatedUser = await this.userRepository.updateProfile(
      id,
      data.full_name,
      data.description,
      data.avatar_url,
      data.level,
      data.nationality,
    );

    return plainToInstanceCustom(UserProfileResponse, updatedUser);
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

  async create(data: any) {
    return await this.userRepository.create(data);
  }
}
