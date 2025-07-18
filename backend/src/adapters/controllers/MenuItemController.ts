import { Request, Response } from 'express';
import { MenuItemUseCase } from '../../application/usecases/MenuItemUseCase';
import { CreateMenuItemRequestDto, UpdateMenuItemRequestDto } from '../../application/dto/MenuItemDto';

export class MenuItemController {
  constructor(private menuItemUseCase: MenuItemUseCase) {}

  async getAllMenuItems(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.menuItemUseCase.getAllMenuItems();
      res.json(result);
    } catch (error) {
      console.error('Error getting menu items:', error);
      res.status(500).json({ 
        error: 'メニューアイテムの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getMenuItemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.menuItemUseCase.getMenuItemById(id);
      
      if (!result) {
        res.status(404).json({ error: 'メニューアイテムが見つかりません' });
        return;
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error getting menu item:', error);
      res.status(500).json({ 
        error: 'メニューアイテムの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getMenuItemsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const result = await this.menuItemUseCase.getMenuItemsByCategory(category);
      res.json(result);
    } catch (error) {
      console.error('Error getting menu items by category:', error);
      res.status(500).json({ 
        error: 'カテゴリ別メニューアイテムの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getAvailableMenuItems(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.menuItemUseCase.getAvailableMenuItems();
      res.json(result);
    } catch (error) {
      console.error('Error getting available menu items:', error);
      res.status(500).json({ 
        error: '利用可能なメニューアイテムの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateMenuItemRequestDto = req.body;
      const result = await this.menuItemUseCase.createMenuItem(data);
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

  async updateMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateMenuItemRequestDto = req.body;
      const result = await this.menuItemUseCase.updateMenuItem(id, data);
      
      if (!result) {
        res.status(404).json({ error: 'メニューアイテムが見つかりません' });
        return;
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error updating menu item:', error);
      res.status(500).json({ 
        error: 'メニューアイテムの更新に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.menuItemUseCase.deleteMenuItem(id);
      
      if (!result) {
        res.status(404).json({ error: 'メニューアイテムが見つかりません' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ 
        error: 'メニューアイテムの削除に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCategorySummary(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.menuItemUseCase.getCategorySummary();
      res.json(result);
    } catch (error) {
      console.error('Error getting category summary:', error);
      res.status(500).json({ 
        error: 'カテゴリ別統計の取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getFilteredMenuItems(req: Request, res: Response): Promise<void> {
    try {
      const { category, minPrice, maxPrice, isAvailable } = req.query;
      
      const filter = {
        category: category ? String(category) : undefined,
        minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
        maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined
      };
      
      const result = await this.menuItemUseCase.getFilteredMenuItems(filter);
      res.json(result);
    } catch (error) {
      console.error('Error getting filtered menu items:', error);
      res.status(500).json({ 
        error: 'フィルタリングされたメニューアイテムの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 