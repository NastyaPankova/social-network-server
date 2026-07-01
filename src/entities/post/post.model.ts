import {
  BelongsTo,
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
  createdAt: Date;
  title: string;
  content: string;
  media: string;
  authorId: number;
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
    type: DataType.DATE,
    field: 'createdAt',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  //todo
  //увеличить поле для текстового контента
  @Column({
    type: DataType.TEXT,
  })
  declare content: string;

  @Column({
    type: DataType.STRING,
  })
  declare media: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'authorId',
  })
  declare authorId: number;

  @BelongsTo(() => User, { foreignKey: 'authorId', as: 'author' })
  author: User;

  @BelongsToMany(() => User, { through: () => Like, as: 'likedByUsers' })
  likes: User[];

  //q
  //дополнительно поле для подсчета лайков
  //через хуки (по сути - триггеры на удаление и добавление записей в таблицу like?)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
    field: 'likesCount',
  })
  likesCount: number;
}
