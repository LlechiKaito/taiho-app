import { Request, Response } from 'express';
import { ChatApplicationService } from '@/application/services/chats/ChatApplicationService';
import { ChatRepository } from '@/domain/repositories/chats/ChatRepository';

export class ChatController {
  private chatApplicationService: ChatApplicationService;

  constructor(
    private chatRepository: ChatRepository
  ) {
    this.chatApplicationService = new ChatApplicationService(chatRepository);
  }

  /**
   * チャット一覧の取得
   */
  async getAllChats(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.chatApplicationService.getAllChats();
      if (result.chats.length === 0) {
        res.status(404).json({ error: 'チャットが見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
} 