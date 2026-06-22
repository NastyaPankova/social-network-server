import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../../entities/user/dto/loginUserDto';
import { CreateUserDto } from '../../entities/user/dto/createUserDto';
import { UserService } from '../../entities/user/user.service';
import { RefreshTokenService } from '../../entities/refreshToken/refreshToken.service';
import { TokenService } from './token.service';
import { PayloadDto } from '../dto/payloadDto';
import { LoginResponse } from '../response/loginResponse';
import { UserResponse } from '../../entities/user/response/userResponse';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private tokenService: TokenService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.tokenService.validateUser(dto);
    const tokens = await this.tokenService.generateToken(user);
    await this.refreshTokenService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return { tokens, user };
  }

  async registration(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    const tokens = await this.tokenService.generateToken(user);
    await this.refreshTokenService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return { tokens, user };
  }

  async logout(refreshToken: string) {
    const deletedTokens =
      await this.refreshTokenService.removeToken(refreshToken);
    return deletedTokens;
  }

  async refresh(refreshToken: string) {
    const token = await this.refreshTokenService.findToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payLoad = await this.tokenService.validateRefreshToken(refreshToken) as PayloadDto;
    if (!payLoad) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserById(payLoad.id);
    if (!user) throw new UnauthorizedException();

    const tokens = await this.tokenService.generateToken(user);
    await this.refreshTokenService.saveRefreshToken(
      payLoad.id,
      tokens.refreshToken,
    );
    return { tokens, user };
  }
}
