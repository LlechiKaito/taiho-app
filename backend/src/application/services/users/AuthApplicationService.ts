import { UserRepository } from '@/domain/repositories/users/UserRepository';
import { AuthUseCase } from '@/application/usecases/users/AuthUseCase';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '@/application/dto/users/AuthDto';

export class AuthApplicationService {
  private authUseCase: AuthUseCase;

  constructor(
    private userRepository: UserRepository
  ) {
    this.authUseCase = new AuthUseCase(userRepository);
  }

  /**
   * ユーザーログイン
   */
  async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.authUseCase.login(request);
  }

  /**
   * ユーザー登録
   */
  async register(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    return await this.authUseCase.register(request);
  }

  /**
   * トークン検証
   */
  verifyToken(token: string): any {
    return this.authUseCase.verifyToken(token);
  }
} 