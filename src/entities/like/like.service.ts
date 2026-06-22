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

  async toggleLike(dto: LikeDto): Promise<{ likesCount: number }> {
    // 1. Ваши отличные проверки на существование сущностей
    await isExistsById(this.userRepository, dto.userId);

    // Сохраняем пост в константу, чтобы потом у него же обновить и забрать likesCount
    await isExistsById(this.postRepository, dto.postId);
    // Примечание: Убедитесь, что ваша функция isExistsById возвращает сам найденный объект поста,
    // а не просто true/false. Если она возвращает только boolean, то перед шагом 3
    // нужно будет сделать: const post = await this.postRepository.findByPk(dto.postId);

    const like = await this.likeRepository.findOne({
      where: {
        userId: dto.userId,
        postId: dto.postId,
      },
    });

    if (like) {
      // Автоматически уменьшит likesCount в таблице posts благодаря хуку @AfterDestroy
      await like.destroy();
    } else {
      // Автоматически увеличит likesCount в таблице posts благодаря хуку @AfterCreate
      await this.likeRepository.create(dto);
    }
    const post = await this.postRepository.findByPk(dto.postId);

    // 2. Перезапрашиваем пост из БД, чтобы получить обновленный счетчик лайков
    await post!.reload();

    // 3. Возвращаем объект для фронтенда. Фронтенд сам поймет статус isLiked
    // (он просто переключит локальный стейт в компоненте, а цифру likesCount возьмет отсюда)
    return {
      likesCount: post!.likesCount,
    };
  }
}
