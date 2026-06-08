import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';

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
  update(@Param('id') id: number, @Body() dto: Partial<CreateUserDto>) {
    return this.userService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'delete user' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'get user by id' })
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'get all users' })
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
