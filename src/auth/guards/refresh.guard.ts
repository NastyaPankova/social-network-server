import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { refreshTokenCookieName } from '../../app/data/cookiesNames';


@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const cookies = request.cookies;

      if (!( refreshTokenCookieName in cookies)) {
        throw new UnauthorizedException({
          message: 'UNAUTHORIZED',
        });
      }

      return true;
    } catch (e) {
      throw new ForbiddenException('FORBIDDEN');
    }
  }
}
