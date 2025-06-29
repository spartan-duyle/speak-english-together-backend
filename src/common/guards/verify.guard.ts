import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserStatus } from '@/common/enum/userStatus.enum';

@Injectable()
export class VerifyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user.status === UserStatus.ACTIVE) return true;

    throw new ForbiddenException(
      'You must verify your account before using this feature',
    );
  }
}
