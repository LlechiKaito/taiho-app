import { Request, Response } from 'express';
import { UserApplicationService } from '@/application/services/users/UserApplicationService';
import { UserRepository } from '@/domain/repositories/users/UserRepository';

export class UserController {
  private userApplicationService: UserApplicationService;

  constructor(
    private userRepository: UserRepository
  ) {
    this.userApplicationService = new UserApplicationService(userRepository);
  }

  /**
   * ユーザー一覧の取得
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userApplicationService.getAllUsers();
      if (result.users.length === 0) {
        res.status(404).json({ error: 'ユーザーが見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * ユーザー詳細の取得
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ユーザーIDは数値である必要があります' });
        return;
      }
      
      const result = await this.userApplicationService.getUserById(id);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'ユーザーが見つかりません' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
} 