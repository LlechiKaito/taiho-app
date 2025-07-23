import { Request, Response } from 'express';
import { MenuItemApplicationService } from '@/application/services/menuItems/MenuItemApplicationService';

export class MenuItemController {
  constructor(private menuItemApplicationService: MenuItemApplicationService) {}

  async getAllMenuItems(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.menuItemApplicationService.getAllMenuItems();
      if (result.items.length === 0) {
        res.status(404).json({ error: 'メニューアイテムが見つかりません' });
        return;
      }
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