import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { roleValues } from '../../data/roleValues';
import { RoleGuard } from '../../auth/role.guard';
import { Roles } from '../../auth/roles.auth.decoretor';

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

  //todo
  /*@ApiOperation({ summary: 'get user by id' })
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }*/

  @ApiOperation({ summary: 'get user by email' })
  @Get(':email')
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
}
