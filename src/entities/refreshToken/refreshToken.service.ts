import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './refreshToken.model';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken)
    private refreshTokenRepository: typeof RefreshToken,
  ) {}
  //q
  //как лучше связывать сущности? Через автоматические $set и $add
  //или как в этой функции?
  async saveRefreshToken(userId: number, refreshToken: string) {
    const oldToken = await this.refreshTokenRepository.findOne({
      where: { userId },
    });
    if (oldToken) {
      oldToken.refreshToken = refreshToken;
      return oldToken.save();
    }
    await this.refreshTokenRepository.create({ refreshToken, userId });
  }

  async removeToken(refreshToken: string) {
    const deletedTokens = await this.refreshTokenRepository.destroy({
      where: { refreshToken },
    });
    if (deletedTokens === 0) {
      throw new NotFoundException('Not found');
    }
  }

  async findToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { refreshToken },
    });
    return token;
  }
}
