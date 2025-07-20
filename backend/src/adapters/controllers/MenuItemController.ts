import { Request, Response } from 'express';
import { MenuItemApplicationService } from '@/application/services/MenuItemApplicationService';

export class MenuItemController {
  constructor(private menuItemApplicationService: MenuItemApplicationService) {}

  async getAllMenuItems(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.menuItemApplicationService.getAllMenuItems();
      res.json(result);
    } catch (error) {
      console.error('Error getting menu items:', error);
      res.status(500).json({ 
        error: 'メニューアイテムの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 