import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserPayload } from '../../authentication/types/user.payload';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (!request.user) throw new BadRequestException();
    return request.user as UserPayload;
  },
);
