import { type } from 'os';
import { UserEntity } from '../user.entity';

export type UserType = Omit<UserEntity, 'hashPassword'>;
