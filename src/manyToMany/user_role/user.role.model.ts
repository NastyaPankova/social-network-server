import {

  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/user.model';
import { Role } from '../../role/role.model';

@Table({ tableName: 'user_role', timestamps: false })
export class User_Role extends Model<User_Role> {
  //todo
  //чем id лучше составного ключа?
  /* @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;*/

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  roleId: number;
}
