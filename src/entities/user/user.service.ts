import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/createUserDto';
import { RoleService } from '../role/role.service';
import { roleValues } from '../../app/data/roleValues';
import * as bcrypt from 'bcryptjs';
import { Role } from '../role/role.model';
import { UpdateUserDto } from './dto/updateUserDto';
import { isExistsById } from '../../app/helpers/existModel';
import { SubscriptionDto } from './dto/subscriptionDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    private roleService: RoleService,
  ) {}

  //q
  //в некоторых методах чистый findByPk, в других -с параметрами
  //как лучше

  async addAdminRoleToUser(user: User) {
    //todo
    //проверить, есть ли уже такая роль у пользователя
    const role = await this.roleService.getRoleByValue(roleValues.ROLE_ADMIN);
    await user.$add('roles', [role.id]);
    await user.reload({ include: [Role] });

    //todo
    //другой вариант реализации
    // async addRoleToUser(dto:AddRoleDto)
    // {
    //   const user = await this.userRepository.findByPk(dto.userId);
    //   const role = await this.roleService.getRoleByValue(dto.roleValue);
    //   if (user && role)
    //   {
    //     await user.$add('roles', [role.id]);
    //     return dto;
    //   }
    //   throw new HttpException('User or role not found', HttpStatus.NOT_FOUND);
    // }
  }

  //todo
  //сделать проверки
  async createUser(dto: CreateUserDto) {
    //q
    //метод относительно редкий, оставить getUserByEmail?
    const user = await this.getUserByEmail(dto.email);

    if (user)
      throw new HttpException(
        `User with email ${dto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    else {
      const role = await this.roleService.getRoleByValue(roleValues.ROLE_USER);
      const hashPass = await bcrypt.hash(dto.password, 5);
      const data = {
        ...dto,
        password: hashPass,
      };
      const new_user = await this.userRepository.create(data);
      await new_user.$add('roles', [role.id]);
      await new_user.reload({ include: [Role] });

      //todo
      /*await this.addAdminRoleToUser(new_user);
      await this.addUserRoleToUser(new_user);
      await new_user.reload({ include: [Role] });*/

      return new_user;
    }
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new HttpException(
        `User ${dto.email} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      const hashPass = await bcrypt.hash(dto.password, 5);
      const data = {
        ...dto,
        password: hashPass,
      };
      const updatedUser = user.update(data);
      return updatedUser;
    }
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    } else {
      await user.destroy();
    }
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: [
        {
          model: Role,
        },
      ],
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: [
        {
          model: Role,
        },
      ],
    });
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async follow(dto: SubscriptionDto) {
    //q
    //вообще не должно сложиться такой ситуации
    if (dto.followingId === dto.followerId) throw new BadRequestException();

    await isExistsById(this.userRepository, dto.followingId);
    await isExistsById(this.userRepository, dto.followerId);

    const follower = await this.userRepository.findByPk(dto.followerId, {
      attributes: ['id', 'name'],
    });
    //q
    //не знаю, как обработать возможные дубликаты
    await follower!.$add('followings', dto.followingId);
  }

  async unfollow(dto: SubscriptionDto) {
    await isExistsById(this.userRepository, dto.followerId);

    const follower = await this.userRepository.findByPk(dto.followerId, {
      attributes: ['id', 'name'],
    });

    await follower!.$remove('followings', dto.followingId);
  }

  //на кого подписан
  async getFollowings(id: number) {
    await isExistsById(this.userRepository, id);
    const user = await this.userRepository.findByPk(id, {
      include: [{ model: User, as: 'followings', attributes: ['id', 'name'] }],
    });
    const userData = user!.get({ plain: true });
    const followings = userData.followings;
    return followings;
    return followings;
  }

  //кто подписан
  async getFollowers(id: number) {
    await isExistsById(this.userRepository, id);
    const user = await this.userRepository.findByPk(id, {
      include: [{ model: User, as: 'followers', attributes: ['id', 'name'] }],
    });
    const userData = user!.get({ plain: true });
    const followers = userData.followers;
    return followers;
  }
}
