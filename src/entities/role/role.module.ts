import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from './role.service';
import { Role } from './role.model';
import { RoleController } from './role.controller';
import { User } from '../user/user.model';
import { User_Role } from '../user_role/user.role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, User_Role])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
