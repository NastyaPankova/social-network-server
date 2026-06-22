import { UserResponse } from '../../entities/user/response/userResponse';

export class LoginResponse {
  accessToken: string;
  user: UserResponse;
}
