import jwt from 'jsonwebtoken';
import { User } from '@/domain/entities/users/User';
import { UserRepository } from '@/domain/repositories/users/UserRepository';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '@/application/dto/users/AuthDto';

export class AuthUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    // 軽度なバリデーション
    if (!request.email || !request.password) {
      throw new Error('メールアドレスとパスワードは必須です');
    }

    // ユーザーを検索
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    // パスワードを検証
    const isValidPassword = await user.verifyPassword(request.password);
    if (!isValidPassword) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    // JWTトークンを生成
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        telephoneNumber: user.telephoneNumber,
        gender: user.gender,
        isAdmin: user.isAdmin,
      },
    };
  }

  async register(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    // 軽度なバリデーション
    if (!request.name || !request.email || !request.password) {
      throw new Error('名前、メールアドレス、パスワードは必須です');
    }

    if (request.password.length < 8) {
      throw new Error('パスワードは8文字以上である必要があります');
    }

    // 既存ユーザーのチェック
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    // パスワードをハッシュ化
    const hashedPassword = await User.hashPassword(request.password);

    // 新しいユーザーを作成
    const newUser = await this.userRepository.create({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      address: request.address,
      telephoneNumber: request.telephoneNumber,
      gender: request.gender,
      isAdmin: false,
    });

    return {
      message: 'ユーザー登録が完了しました',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        telephoneNumber: newUser.telephoneNumber,
        gender: newUser.gender,
        isAdmin: newUser.isAdmin,
      },
    };
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  verifyToken(token: string): any {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('無効なトークンです');
    }
  }
} 