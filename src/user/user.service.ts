import { plainToInstanceCustom } from 'src/helpers/helpers';
import { UserModel } from './model/user.model';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import { PrismaService } from 'src/prisma/prisma.serivce';
import { UserStatus } from './enum/userStatus.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByEmail(email: string): Promise<UserModel> {
    const user = this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return plainToInstanceCustom(UserModel, user);
  }

  async markEmailAsConfirmed(email: string) {
    return this.prismaService.user.update({
      where: { email },
      data: { status: UserStatus.ACTIVE },
    });
  }
}
