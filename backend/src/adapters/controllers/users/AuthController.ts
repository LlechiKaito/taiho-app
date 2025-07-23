import { Request, Response } from 'express';
import { AuthApplicationService } from '@/application/services/users/AuthApplicationService';
import { UserRepository } from '@/domain/repositories/users/UserRepository';
import {
  LoginRequestDto,
  RegisterRequestDto,
} from '@/application/dto/users/AuthDto';

export class AuthController {
  private authApplicationService: AuthApplicationService;

  constructor(
    private userRepository: UserRepository
  ) {
    this.authApplicationService = new AuthApplicationService(userRepository);
  }

  /**
   * ユーザーログイン
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequestDto = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'メールアドレスとパスワードは必須です' });
        return;
      }

      const result = await this.authApplicationService.login({ email, password });
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        // バリデーションエラーは400、認証エラーは401
        if (error.message.includes('メールアドレスまたはパスワードが正しくありません')) {
          res.status(401).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  /**
   * ユーザー登録
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        address,
        telephoneNumber,
        gender,
      }: RegisterRequestDto = req.body;

      if (!name || !email || !password || !address || !telephoneNumber || !gender) {
        res.status(400).json({ error: 'すべての項目は必須です' });
        return;
      }

      const result = await this.authApplicationService.register({
        name,
        email,
        password,
        address,
        telephoneNumber,
        gender,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        // バリデーションエラーは400
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  /**
   * トークン検証
   */
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: '認証トークンが必要です' });
        return;
      }

      const token = authHeader.substring(7);
      const decoded = this.authApplicationService.verifyToken(token);
      res.json({ valid: true, user: decoded });
    } catch (error) {
      res.status(401).json({ error: '無効なトークンです' });
    }
  }
} 