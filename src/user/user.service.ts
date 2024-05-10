import { plainToInstanceCustom } from 'src/helpers/helpers';
import { UserModel } from './model/user.model';
import { PrismaService } from 'src/prisma/prisma.serivce';
import { UserStatus } from './enum/userStatus.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserProfileResponse } from './response/userProfile.response';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByEmail(email: string): Promise<UserModel> {
    const user = this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstanceCustom(UserModel, user);
  }

  async markEmailAsConfirmed(email: string) {
    return this.prismaService.user.update({
      where: { email },
      data: { status: UserStatus.ACTIVE },
    });
  }

  async userProfile(id: number): Promise<UserProfileResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id, deleted_at: null },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstanceCustom(UserProfileResponse, user);
  }

  async updateUserProfile(id: number, data: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = this.prismaService.user.update({
      where: { id },
      data: {
        full_name: data.full_name,
        description: data.description,
        avatar_url: data.avatar_url,
        level: data.level,
        nationality: data.nationality,
      },
    });

    return plainToInstanceCustom(UserProfileResponse, updatedUser);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (data.new_password !== data.confirm_password) {
      throw new BadRequestException('Password does not match');
    }

    const hashedPassword = await bcrypt.hash(data.new_password, 10);

    await this.prismaService.user.update({
      where: { id: id },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
      },
    });
  }
}
