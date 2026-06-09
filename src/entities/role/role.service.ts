import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleDto } from './dto/roleDto';
import { Role } from './role.model';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}
  async createRole(dto: RoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }
  //todo
  //find and create?
  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    if (!role) {
      throw new Error('Not found');
    } else return role;
  }
}
