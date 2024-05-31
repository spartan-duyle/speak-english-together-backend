import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/database/prisma/prisma.serivce';
import { Role } from '@/common/enum/role.enum';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('auth.jwtSecret'),
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
        deleted_at: null,
      },
    });

    if (!user) return null;

    delete user.password;
    if (user.role === Role.USER || user.role === Role.ADMIN) return user;
  }
}
