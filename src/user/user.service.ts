import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/createUserDto';
import { RoleService } from '../role/role.service';
import { roleValues } from '../data/roleValues';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    private roleService: RoleService,
  ) {}

  //todo
  //сделать проверки

  async createUser(dto: CreateUserDto) {
    const user = await this.getUserByEmail(dto.email);

    if (user)
      throw new HttpException(
        `User with email ${dto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    else {
      const hashPass = await bcrypt.hash(dto.password, 5);
      const new_user = await this.userRepository.create({
        ...dto,
        password: hashPass,
      });
      const role = await this.roleService.getRoleByValue(roleValues.ROLE_USER);
      await new_user.$set('role', [role.id]);
      //todo
      //разобраться со связыванием полей из БД и внутри моделей
      new_user.role = [role];
      return new_user;
    }
  }

  async updateUser(id: number, dto: Partial<CreateUserDto>) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new Error('Not found');
    } else {
      const updatedUser = user.update(dto);
      return updatedUser;
    }
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new Error('Not found');
    } else {
      user.destroy();
    }
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new Error('Not found');
    } else return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }
}
