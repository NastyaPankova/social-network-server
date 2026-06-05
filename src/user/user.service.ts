import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserDto } from './dto/userDto';
import { RoleService } from '../role/role.service';
import { roleValues } from '../data/roleValues';

@Injectable()
export class UserService {
  constructor(@InjectModel(User)
              private userRepository: typeof User,
              private roleService: RoleService,
  ) {}
  async createUser(dto: UserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue(roleValues.ROLE_USER);
    await user.$set('role', [role.id]);
    return user;
  }

  async updateUser(id: number, dto: Partial<UserDto>) {
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

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }
}
