import { User } from '../../entities/user/user.model';
import { LoginUserDto } from '../../entities/user/dto/loginUserDto';
import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../entities/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokensDto } from '../dto/authTokensDto';
import { PayloadDto } from '../dto/payloadDto';
import { accessTokenExpirationTime, refreshTokenExpirationTime } from '../../app/data/expirationTime';

@Injectable()
export class TokenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getToken(
    payload: PayloadDto,
    pathToKey: string,
    pathToExpirationTime: string,
    isAccess: boolean,
  ) {
    const expirationTime = isAccess
      ? accessTokenExpirationTime
      : refreshTokenExpirationTime; //if access then 10min else (refresh) 10d

    const accessSecretKey =
      this.configService.get<string>(pathToKey) || 'MySecret';

    const accessExpiresInSeconds =
      this.configService.get<number>(pathToExpirationTime) || expirationTime;

    const token = await this.jwtService.signAsync(payload, {
      secret: accessSecretKey,
      expiresIn: accessExpiresInSeconds,
    });
    return token;
  }

  async generateToken(user: User) {
    const plainUser = user.get({ plain: true });
    const payload: PayloadDto = {
      email: plainUser.email,
      id: plainUser.id,
      roles: plainUser.roles,
    };

    //q
    //что это?
    const tokens: AuthTokensDto = {
      accessToken: '',
      refreshToken: '',
    };

    tokens.accessToken = await this.getToken(
      payload,
      'JWT_ACCESS_SECRET',
      'JWT_ACCESS_EXPIRES_IN',
      true,
    );

    tokens.refreshToken = await this.getToken(
      payload,
      'JWT_REFRESH_SECRET',
      'JWT_REFRESH_EXPIRES_IN',
      false,
    );
    return tokens;
  }

  async validateUser(dto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user) {
      const isEqual = await bcrypt.compare(dto.password, user.password);
      if (isEqual) return user;
      else
        throw new UnauthorizedException({
          message: 'Invalid password',
        });
    } else {
      throw new UnauthorizedException({ message: 'Invalid email' });
    }
  }

  async validateAccessToken(token: string) {
    const accessSecretKey =
      this.configService.get<string>('JWT_ACCESS_SECRET') || 'MySecret';
    const data = await this.jwtService.verifyAsync(token, {
      secret: accessSecretKey,
    });
    return data;
  }

  async validateRefreshToken(token: string) {
    const refreshSecretKey =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'MySecret';
    const data = await this.jwtService.verifyAsync(token, {
      secret: refreshSecretKey,
    });
    return data;
  }
}
