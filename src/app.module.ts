import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './entities/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user/user.model';
import { RoleModule } from './entities/role/role.module';
import { Role } from './entities/role/role.model';
import { Post } from './entities/post/post.model';
import { User_RoleModule } from './entities/user_role/user.role.module';
import { User_Role } from './entities/user_role/user.role.model';
import { SeedController } from './app/seed/seed.controller';
import { SeedModule } from './app/seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './entities/post/post.module';
import { LikeModule } from './entities/like/like.module';
import { User_UserModule } from './entities/user_user/user_user.module';
import { Like } from './entities/like/like.model';
import { User_User } from './entities/user_user/user_user.model';
import { RefreshTokenModule } from './entities/refreshToken/refreshToken.module';
import cookieParser from 'cookie-parser';
import { RefreshToken } from './entities/refreshToken/refreshToken.model';
import { Sequelize } from 'sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/static',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [RefreshToken, User, Role, User_Role, Post, Like, User_User],
      autoLoadModels: true,
      //todo
      //удалить!!!
      sync: { force: true },
      //todo
      //сбрасывает внешние ключи перед удалением
      //затем устанавливает перед созданием
      hooks: {
        beforeBulkSync: async function (this: Sequelize) {
          await this.query('SET FOREIGN_KEY_CHECKS = 0;');
        },
        afterBulkSync: async function (this: Sequelize) {
          await this.query('SET FOREIGN_KEY_CHECKS = 1;');
        },
      },
    }),
    UserModule,
    RoleModule,
    User_RoleModule,
    SeedModule,
    AuthModule,
    PostModule,
    LikeModule,
    User_UserModule,
    RefreshTokenModule,
  ],
  controllers: [SeedController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
