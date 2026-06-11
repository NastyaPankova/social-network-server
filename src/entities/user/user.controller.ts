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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { roleValues } from '../../app/data/roleValues';
import { RoleGuard } from '../../auth/role.guard';
import { Roles } from '../../auth/roles.auth.decoretor';
import { UpdateUserDto } from './dto/updateUserDto';

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
  @Get('id/:id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
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
}
