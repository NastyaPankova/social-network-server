import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/createUserDto';
import { RoleService } from '../role/role.service';
import { roleValues } from '../data/roleValues';
import * as bcrypt from 'bcryptjs';
import { Role } from '../role/role.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    private roleService: RoleService,
  ) {}

  //todo
  //подумать, где можно вернуть не пользователя, а только id
  //по возможности заменить getbyemail на getbyid (по id ищется быстрее???)

  async addAdminRoleToUser(user: User) {
    //todo
    //проверить, есть ли уже такая роль у пользователя
    const role = await this.roleService.getRoleByValue(roleValues.ROLE_ADMIN);
    await user.$add('roles', [role.id]);
    await user.reload({ include: [Role] });
  }

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
      await user.destroy();
    }
  }

  /*async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new Error('Not found');
    } else return user;
  }*/

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
}
