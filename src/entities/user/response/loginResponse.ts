import { UserResponse } from './userResponse';

export class LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}
