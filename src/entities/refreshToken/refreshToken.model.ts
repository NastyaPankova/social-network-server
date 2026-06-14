import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../user/user.model';
interface RefreshTokenAttributes {
  refreshToken: string;
  userId: number;
}

@Table({ tableName: 'refresh_token', timestamps: false })
export class RefreshToken extends Model<RefreshToken, RefreshTokenAttributes> {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare refreshToken: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;
}
