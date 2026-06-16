import { Role } from '../../entities/role/role.model';

export class PayloadDto {
  //todo
  //удалить email из payload
  email: string;
  id: number;
  roles: Role[];
}
