import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User_RoleService } from './user.role.service';
import { User_Role } from './user.role.model';
import { User_RoleController } from './user.role.controller';
import { User } from '../../user/user.model';
import { Role } from '../../role/role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, User_Role])],
  controllers: [User_RoleController],
  providers: [User_RoleService],
})
export class User_RoleModule {}
