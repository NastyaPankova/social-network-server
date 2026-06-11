import {
  AfterCreate,
  AfterDestroy,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';
import { LikeDto } from './dto/likeDto';

//q
//добавила LikeDto для корректной работы метода .create
//почему?

@Table({ tableName: 'like', timestamps: false })
export class Like extends Model<Like, LikeDto> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  userId: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  postId: number;

  //q
  //триггер на добавление записи?
  @AfterCreate
  static async incLikes(instance: Like) {
    await Post.increment('likesCount', {
      by: 1,
      where: { id: instance.postId },
    });
  }

  //q
  //триггер на удаление записи?
  @AfterDestroy
  static async decLikes(instance: Like) {
    await Post.decrement('likesCount', {
      by: 1,
      where: { id: instance.postId },
    });
  }
}
