import { Role } from '../../entities/role/role.model';

export class PayloadDto {
  id: number;
  name: string;
  roles: Role[];
}
