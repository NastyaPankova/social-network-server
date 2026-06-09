import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.auth.decoretor';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //todo
    //remove comm below
    //const request = context.switchToHttp().getRequest();
    try {
      const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      const user = this.jwtService.verify(token);
      request.user = user;
      return user.roles.some(role => roles.includes(role.value));
    } catch (error) {
      //todo
      //console.log(error.message);
      //todo
      //как вывести именно 'Access denied'???
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
  }
}
