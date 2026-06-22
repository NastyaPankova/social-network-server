import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../../entities/role/role.model';
import { User } from '../../entities/user/user.model';
import { Post } from '../../entities/post/post.model';
import { SeedService } from './seed.service';
import { UserModule } from '../../entities/user/user.module';
import { RoleModule } from '../../entities/role/role.module';
import { PostModule } from '../../entities/post/post.module';
import { LikeModule } from '../../entities/like/like.module';
import { Like } from '../../entities/like/like.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Post, Like]),
    LikeModule,
    UserModule,
    RoleModule,
    PostModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
