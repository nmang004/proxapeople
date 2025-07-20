import { User, InsertUser } from '@shared/schema';

export type { User, InsertUser };

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface UserPermissionCheck {
  userId: number;
  permission: string;
  action: string;
}