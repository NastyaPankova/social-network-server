import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../../entities/user/dto/loginUserDto';
import { CreateUserDto } from '../../entities/user/dto/createUserDto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import express from 'express';
import { setCookieOptions } from '../../app/helpers/setCookieOptions';
import { refreshTokenExpirationTime } from '../../app/data/expirationTime';
import { refreshTokenCookieName } from '../../app/data/cookiesNames';
import { LoginResponse } from '../response/loginResponse';
import { UserResponse } from '../../entities/user/response/userResponse';
import { AuthGuard } from '../guards/auth.guard';
import * as authRequest from '../dto/authRequest';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private aurhService: AuthService) {}

  //q
  //*
  @ApiOperation({ summary: 'login (email, password)' })
  @Post('/login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const data = await this.aurhService.login(dto);

    response.cookie(
      refreshTokenCookieName,
      data.tokens.refreshToken,
      setCookieOptions(refreshTokenExpirationTime),
    );

    const user: UserResponse = {
      id: data.user.id,
      name: data.user.name,
    };

    const loginRespons: LoginResponse = {
      accessToken: data.tokens.accessToken,
      user: user,
    };

    return loginRespons;
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
      data.tokens.refreshToken,
      setCookieOptions(refreshTokenExpirationTime),
    );

    const user: UserResponse = {
      id: data.user.id,
      name: data.user.name,
    };

    const loginRespons: LoginResponse = {
      accessToken: data.tokens.accessToken,
      user: user,
    };

    return loginRespons;
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
      data.tokens.refreshToken,
      setCookieOptions(refreshTokenExpirationTime),
    );

    const user: UserResponse = {
      id: data.user.id,
      name: data.user.name,
    };

    const loginRespons: LoginResponse = {
      accessToken: data.tokens.accessToken,
      user: user,
    };

    return loginRespons;
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() request: authRequest.AuthRequest) {
    const user = {
      id: request.user.id,
      name: request.user.name,
    };
    return user;
  }
}
