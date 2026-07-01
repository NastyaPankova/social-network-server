import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { User_User } from './user_user.model';
import { User_UserController } from './user_user.controller';
import { User_UserService } from './user_user.service';

@Module({
  imports: [SequelizeModule.forFeature([User, User_User])],
  controllers: [User_UserController],
  providers: [User_UserService],
})
export class User_UserModule {}
