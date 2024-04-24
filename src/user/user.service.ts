import { PlainToInstance } from 'src/helpers/helpers';
import { UserModel } from './model/user.model';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import CreateUserDto from './dto/createUser.dto';
import { PrismaService } from 'src/prisma/prisma.serivce';

export default class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByEmail(email: string): Promise<UserModel> {
    const user = this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return PlainToInstance(UserModel, user);
  }

  async create(data: CreateUserDto): Promise<UserModel> {
    const user = this.prismaService.user.create({ data: data });
    return PlainToInstance(UserModel, user);
  }
}
