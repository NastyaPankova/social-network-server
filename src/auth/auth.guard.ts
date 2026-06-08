import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    try{
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    }
    catch (error)

    {
      console.log(error.message);
      throw new UnauthorizedException({ message: 'Unauthorized (from guard)' });
    }
  }
}