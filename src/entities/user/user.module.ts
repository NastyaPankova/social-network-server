import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from '../role/role.model';
import { User_Role } from '../user_role/user.role.model';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../../auth/auth.module';
import { LikeModule } from '../like/like.module';
import { Like } from '../like/like.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, User_Role, Like]),
    RoleModule,
    LikeModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
