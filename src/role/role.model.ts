import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { User_Role } from '../manyToMany/user_role/user.role.model';

interface RoleCreationAttributes {
  value: string;
}

@Table({ tableName: 'role', timestamps: false })
export class Role extends Model<Role, RoleCreationAttributes> {
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
  declare value: string;

  @BelongsToMany(() => User, () => User_Role)
  user: User[];
}
