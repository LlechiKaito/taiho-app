import { User } from '@/domain/entities/users/User';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: {
    name: string;
    email: string;
    password: string;
    address: string;
    telephoneNumber: string;
    gender: string;
    isAdmin: boolean;
  }): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User | null>;
} 