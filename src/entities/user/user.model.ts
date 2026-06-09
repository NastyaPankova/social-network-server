import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { User_Role } from '../user_role/user.role.model';
import { Post } from '../post/post.model';
import { Like } from '../like/like.model';
import { User_User } from '../user_user/user_user.model';

//todo
//UserCreationAttributes
//для чего? Добавить name?

interface UserCreationAttributes {
  email: string;
  password: string;
}

@Table({ tableName: 'user', timestamps: false })
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @BelongsToMany(() => Role, () => User_Role)
  roles: Role[];

  @HasMany(() => Post, { onDelete: 'CASCADE' })
  posts: Post[];

  @BelongsToMany(() => Post, () => Like)
  likes: Post[];

  //на кого подписан
  @BelongsToMany(() => User, () => User_User, 'followerId', 'followingId')
  followings: User[];

  //подписчики
  @BelongsToMany(() => User, () => User_User, 'followingId', 'followerId')
  followers: User[];
}
