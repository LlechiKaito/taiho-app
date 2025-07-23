import { User } from '@/domain/entities/users/User';
import { UserRepository } from '@/domain/repositories/users/UserRepository';
import {
  UserResponseDto,
  UserListResponseDto,
} from '@/application/dto/users/UserDto';

export class UserUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async getAllUsers(): Promise<UserListResponseDto> {
    const users = await this.userRepository.findAll();
    const responseUsers = users.map(user => this.toResponseDto(user));
    
    return {
      users: responseUsers,
      total: responseUsers.length
    };
  }

  async getUserById(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.toResponseDto(user) : null;
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      telephoneNumber: user.telephoneNumber,
      gender: user.gender,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
} 