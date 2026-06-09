import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';

@Table({ tableName: 'like', timestamps: false })
export class Like extends Model<Like> {
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
}
