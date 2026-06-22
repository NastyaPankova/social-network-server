import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.model';

import { UserModule } from '../user/user.module';
import { Post } from './post.model';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Like } from '../like/like.model';

@Module({
  imports: [SequelizeModule.forFeature([Post, User, Like]), UserModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
