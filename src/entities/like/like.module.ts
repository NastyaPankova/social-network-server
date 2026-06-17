import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';
import { Like } from './like.model';

@Module({
  imports: [SequelizeModule.forFeature([Post, User, Like])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
