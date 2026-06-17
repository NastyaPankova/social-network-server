import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../../entities/user/dto/loginUserDto';
import { CreateUserDto } from '../../entities/user/dto/createUserDto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import express from 'express';
import { setCookieOptions } from '../../app/helpers/setCookieOptions';
import { refreshTokenExpirationTime } from '../../app/data/expirationTime';
import { refreshTokenCookieName } from '../../app/data/cookiesNames';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private aurhService: AuthService) {}

  @ApiOperation({ summary: 'login (email, password)' })
  @Post('/login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const data = await this.aurhService.login(dto);

    response.cookie(
      refreshTokenCookieName,
      data.refreshToken,
      setCookieOptions(refreshTokenExpirationTime),
    );

    return data;
  }
  @ApiOperation({ summary: 'registration (email, password, name)' })
  @Post('/registration')
  async registration(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const data = await this.aurhService.registration(dto);

    response.cookie(
      refreshTokenCookieName,
      data.refreshToken,
      setCookieOptions(refreshTokenExpirationTime),
    );

    return data;
  }

  //q
  //важный вопрос!
  //я так и не поняла, откуда мы взяли request
  //какой тип запроса post или delete?
  @ApiOperation({ summary: 'logout' })
  @Post('/logout')
  async logout(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const refreshToken = request.cookies[refreshTokenCookieName] as string;
    const token = await this.aurhService.logout(refreshToken);
    response.clearCookie(refreshTokenCookieName);
    return { message: token, success: true };
  }

  @ApiOperation({ summary: 'refresh token' })
  @Post('/refresh')
  async refresh(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ) {

    const refreshToken = request.cookies[refreshTokenCookieName] as string;
    const data = await this.aurhService.refresh(refreshToken);

    response.cookie(
      refreshTokenCookieName,
      data.refreshToken,
      setCookieOptions(refreshTokenExpirationTime),
    );

    return data;
  }
}
