import { UserType } from './user.types';
export interface IUserResponse {
  user: UserType & { token: string };
}
