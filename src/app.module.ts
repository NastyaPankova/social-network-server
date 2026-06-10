import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './entities/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user/user.model';
import { RoleModule } from './entities/role/role.module';
import { Role } from './entities/role/role.model';
import { Post } from './entities/post/post.model';
import { User_RoleModule } from './entities/user_role/user.role.module';
import { User_Role } from './entities/user_role/user.role.model';
import { SeedController } from './seed/seed.controller';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { PostService } from './entities/post/post.service';
import { PostController } from './entities/post/post.controller';
import { PostModule } from './entities/post/post.module';
import { LikeModule } from './entities/like/like.module';
import { User_UserService } from './entities/user_user/user_user.service';
import { User_UserController } from './entities/user_user/user_user.controller';
import { User_UserModule } from './entities/user_user/user_user.module';
import { Like } from './entities/like/like.model';
import { User_User } from './entities/user_user/user_user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [User, Role, User_Role, Post, Like, User_User],
      autoLoadModels: true,
      //todo
      //удалить!!!
      sync: { force: true },
    }),
    UserModule,
    RoleModule,
    User_RoleModule,
    SeedModule,
    AuthModule,
    PostModule,
    LikeModule,
    User_UserModule,
  ],
  controllers: [SeedController],
  providers: [],
})
export class AppModule {}
