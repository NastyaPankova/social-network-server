import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refreshToken.service';
import { RefreshTokenController } from './refreshToken.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './refreshToken.model';

@Module({
  imports: [SequelizeModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService],
  controllers: [RefreshTokenController],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
