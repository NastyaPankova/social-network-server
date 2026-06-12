import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'user_user', timestamps: false })
export class User_User extends Model<User_User> {
  //Follower - подписчик (кто подписан)
  //Following - тот, на кого подписан

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare followerId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare followingId: number;
}
