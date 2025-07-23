import { UserRepository } from '@/domain/repositories/users/UserRepository';
import { UserUseCase } from '@/application/usecases/users/UserUseCase';
import {
  UserResponseDto,
  UserListResponseDto,
} from '@/application/dto/users/UserDto';

export class UserApplicationService {
  private userUseCase: UserUseCase;

  constructor(
    private userRepository: UserRepository
  ) {
    this.userUseCase = new UserUseCase(userRepository);
  }

  /**
   * ユーザー一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllUsers(): Promise<UserListResponseDto> {
    return await this.userUseCase.getAllUsers();
  }

  /**
   * ユーザー詳細の取得
   */
  async getUserById(id: number): Promise<UserResponseDto | null> {
    return await this.userUseCase.getUserById(id);
  }
} 