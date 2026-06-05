import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from '../role/role.model';
import { User_Role } from '../manyToMany/user_role/user.role.model';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, User_Role]),
  RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
