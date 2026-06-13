import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../user/user.model';

@Table({ tableName: 'refToken', timestamps: false })
export class RefToken extends Model<RefToken> {

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare refreshToken: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number;
}
