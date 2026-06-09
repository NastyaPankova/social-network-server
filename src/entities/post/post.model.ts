import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../user/user.model';
import { Like } from '../like/like.model';

interface PostCreationAttributes {
  title: string;
  date: Date;
  content: string;
  media: string;
}

@Table({ tableName: 'post', timestamps: false })
export class Post extends Model<Post, PostCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare date: Date;

  //todo
  //увеличить поле для текстового контента
  @Column({
    type: DataType.STRING,
  })
  declare content: string;

  @Column({
    type: DataType.STRING,
  })
  declare media: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare authorId: number;

  @BelongsToMany(() => User, () => Like)
  likes: User[];
}
