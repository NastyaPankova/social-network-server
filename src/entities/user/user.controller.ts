import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { roleValues } from '../../app/data/roleValues';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/roles.auth.decorator';
import { UpdateUserDto } from './dto/updateUserDto';
import { SubscriptionDto } from './dto/subscriptionDto';
import { UserResponse } from './response/userResponse';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'create user' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @ApiOperation({ summary: 'update user' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'delete user' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'get user by id' })
  @Get(':id')
  async getUserById(@Param('id',ParseIntPipe) id: number) {
    const data = await this.userService.getUserById(id);
    if (!data) throw new NotFoundException();

    const response: UserResponse = {
      id: data.id,
      name: data.name,
    };

    return response;
  }

  @ApiOperation({ summary: 'get user by email' })
  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'get all users' })
  @ApiBearerAuth('token')
  @Roles(roleValues.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  //todo
  //вариант объединения контролеров
  // @ApiOperation({ summary: 'get user by id or email' })
  // @Get(':identifier')
  // getUser(@Param('identifier') identifier: string) {
  //    //   const id = Number(identifier);
  //   if (!isNaN(id)) {
  //     return this.userService.getUserById(id);
  //   }
  //   return this.userService.getUserByEmail(identifier);
  // }

  //q
  //варианты получения id пользователей, предложенные ИИ
  @ApiOperation({ summary: 'subscribe' })
  // @UseGuards(JwtAuthGuard) // Раскомментируйте, если есть авторизация (ИИ)
  @Post(':id/follow')
  async follow(@Body() dto: SubscriptionDto) {
    //async follow(
    // @Param('id', ParseIntPipe) followingId: number, // (ИИ)
    //@Req() req: any, // req.user.id должен приходить из вашей стратегии авторизации (ИИ)
    // const currentUserId = req.user.id; // ID текущего авторизованного юзера (ИИ)
    //await this.userService.follow(currentUserId, followingId); (ИИ)
    await this.userService.follow(dto);
    return { message: 'Subscribe' };
  }

  @ApiOperation({ summary: 'unsubscribe' })
  // @UseGuards(JwtAuthGuard)
  @Delete(':id/unfollow')
  async unfollow(@Body() dto: SubscriptionDto) {
    await this.userService.unfollow(dto);
    return { message: 'Unsubscribe' };
  }

  @ApiOperation({ summary: 'user`s followings' })
  @Get(':id/followings')
  async getFollowings(@Param('id') id: number) {
    return this.userService.getFollowings(id);
  }

  @ApiOperation({ summary: 'user`s followers' })
  @Get(':id/followers')
  async getFollowers(@Param('id') id: number) {
    return this.userService.getFollowers(id);
  }
}
