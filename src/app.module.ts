import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.model';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.model';
import { User_RoleModule } from './manyToMany/user_role/user.role.module';
import { User_Role } from './manyToMany/user_role/user.role.model';
import { SeedController } from './seed/seed.controller';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';

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
      models: [User, Role, User_Role],
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
  ],
  controllers: [SeedController],
  providers: [],
})
export class AppModule {}
