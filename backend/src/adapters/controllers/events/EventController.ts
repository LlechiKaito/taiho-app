import { Request, Response } from 'express';
import { EventApplicationService } from '@/application/services/events/EventApplicationService';
import { EventRepository } from '@/domain/repositories/events/EventRepository';
import { CreateEventRequestDto, UpdateEventRequestDto } from '@/application/dto/events/EventDto';
import { AuthenticatedRequest } from '@/adapters/middleware/authMiddleware';

export class EventController {
  private eventApplicationService: EventApplicationService;

  constructor(
    private eventRepository: EventRepository
  ) {
    this.eventApplicationService = new EventApplicationService(eventRepository);
  }

  /**
   * イベント一覧の取得
   */
  async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.eventApplicationService.getAllEvents();
      if (result.events.length === 0) {
        res.status(404).json({ error: 'イベントが見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * イベント詳細の取得
   */
  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await this.eventApplicationService.getEventById(id);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * イベントの作成（管理者のみ）
   */
  async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const request: CreateEventRequestDto = req.body;

      // バリデーション
      if (!request.photoUrl || request.priority === undefined) {
        res.status(400).json({ error: 'photoUrlとpriorityは必須です' });
        return;
      }

      const result = await this.eventApplicationService.createEvent(request);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'イベントの作成に失敗しました' });
      }
    }
  }

  /**
   * イベントの更新（管理者のみ）
   */
  async updateEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'イベントIDは数値である必要があります' });
        return;
      }

      const request: UpdateEventRequestDto = req.body;

      // バリデーション
      if (!request.photoUrl && request.priority === undefined) {
        res.status(400).json({ error: '更新する項目を指定してください' });
        return;
      }

      const result = await this.eventApplicationService.updateEvent(id, request);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'イベントが見つかりません' });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'イベントの更新に失敗しました' });
      }
    }
  }

  /**
   * イベントの削除（管理者のみ）
   */
  async deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'イベントIDは数値である必要があります' });
        return;
      }

      const result = await this.eventApplicationService.deleteEvent(id);
      
      if (result) {
        res.json({ message: 'イベントを削除しました' });
      } else {
        res.status(404).json({ error: 'イベントが見つかりません' });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'イベントの削除に失敗しました' });
      }
    }
  }
} 