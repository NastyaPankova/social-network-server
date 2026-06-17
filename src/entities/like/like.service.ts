import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './like.model';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';
import { LikeDto } from './dto/likeDto';
import { isExistsById } from '../../app/helpers/existModel';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like) private likeRepository: typeof Like,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Post) private postRepository: typeof Post,
  ) {}
  //q
  //добавить глобальный фильтр для перехвата ошибок уникальности записей в таблице?

  async setLike(dto: LikeDto) {
    await isExistsById(this.userRepository, dto.userId);
    await isExistsById(this.postRepository, dto.postId);

    try {
      //todo
      //должно сработать на увеличение likesCount в Post
      await this.likeRepository.create({ ...dto });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new HttpException(`Already liked`, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async removeLike(dto: LikeDto) {
    const like = await this.likeRepository.findOne({
      where: {
        userId: dto.userId,
        postId: dto.postId,
      },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }
    await like.destroy();
  }

  //q
  //как альтернатива двум методам выше
  //todo
  //заменить на это
  // функия возвращает объект с полем isLiked типа boolean
  // async toggleLike(dto: LikeDto): Promise<{ isLiked: boolean }> (***)

  async toggleLike(dto: LikeDto) {
    await isExistsById(this.userRepository, dto.userId);
    await isExistsById(this.postRepository, dto.postId);

    const like = await this.likeRepository.findOne({
      where: {
        userId: dto.userId,
        postId: dto.postId,
      },
    });

    if (like) {
      await like.destroy();
      //todo
      //для фронта (***)
      //return { isLiked: false };
    } else {
      await this.likeRepository.create(dto);
      //todo
      //для фронта (***)
      //return { isLiked: true };
    }
  }
}
