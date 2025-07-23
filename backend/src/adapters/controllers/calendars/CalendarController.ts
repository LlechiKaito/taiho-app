import { Request, Response } from 'express';
import { CalendarApplicationService } from '@/application/services/calendars/CalendarApplicationService';
import { CalendarRepository } from '@/domain/repositories/calendars/CalendarRepository';
import { CreateCalendarRequestDto, UpdateCalendarRequestDto } from '@/application/dto/calendars/CalendarDto';
import { AuthenticatedRequest } from '@/adapters/middleware/authMiddleware';

export class CalendarController {
  private calendarApplicationService: CalendarApplicationService;

  constructor(
    private calendarRepository: CalendarRepository
  ) {
    this.calendarApplicationService = new CalendarApplicationService(calendarRepository);
  }

  /**
   * カレンダー一覧の取得
   */
  async getAllCalendars(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.calendarApplicationService.getAllCalendars();
      if (result.calendars.length === 0) {
        res.status(404).json({ error: 'カレンダーが見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * カレンダー詳細の取得
   */
  async getCalendarById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await this.calendarApplicationService.getCalendarById(id);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Calendar not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * カレンダーの作成（管理者のみ）
   */
  async createCalendar(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const request: CreateCalendarRequestDto = req.body;

      // バリデーション
      if (!request.photoUrl || !request.timestamp) {
        res.status(400).json({ error: 'photoUrlとtimestampは必須です' });
        return;
      }

      const result = await this.calendarApplicationService.createCalendar(request);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating calendar:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'カレンダーの作成に失敗しました' });
      }
    }
  }

  /**
   * カレンダーの更新（管理者のみ）
   */
  async updateCalendar(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'カレンダーIDは数値である必要があります' });
        return;
      }

      const request: UpdateCalendarRequestDto = req.body;

      // バリデーション
      if (!request.photoUrl && request.timestamp === undefined) {
        res.status(400).json({ error: '更新する項目を指定してください' });
        return;
      }

      const result = await this.calendarApplicationService.updateCalendar(id, request);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'カレンダーが見つかりません' });
      }
    } catch (error) {
      console.error('Error updating calendar:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'カレンダーの更新に失敗しました' });
      }
    }
  }
} 