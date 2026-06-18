import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRequest } from '../dto/authRequest';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Добавляем ConfigService в конструктор
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    try {
      const authHeader = request.headers.authorization;


      if (!authHeader) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }


      const accessSecretKey =
        this.configService.get<string>('JWT_ACCESS_SECRET') || 'MySecret';

      const user = this.jwtService.verify(token, { secret: accessSecretKey });

      request.user = user;
      return true;
    } catch (error: any) {
      console.log('Guard Error:', error.message);

      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
