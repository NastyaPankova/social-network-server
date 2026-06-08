import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { User_Role } from '../manyToMany/user_role/user.role.model';

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
}
