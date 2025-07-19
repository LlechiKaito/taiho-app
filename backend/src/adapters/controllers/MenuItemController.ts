import { Request, Response } from 'express';
import { MenuItemApplicationService } from '../../application/services/MenuItemApplicationService';
import { CreateMenuItemRequestDto } from '../../application/dto/MenuItemDto';

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

  async createMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateMenuItemRequestDto = req.body;
      const result = await this.menuItemApplicationService.createMenuItem(data);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating menu item:', error);
      if (error instanceof Error) {
        res.status(400).json({ 
          error: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'メニューアイテムの作成に失敗しました',
          details: 'Unknown error'
        });
      }
    }
  }
} 