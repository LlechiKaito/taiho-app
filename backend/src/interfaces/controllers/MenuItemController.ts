import { Request, Response } from 'express';
import { MenuItemApplicationService } from '@/application/services/MenuItemApplicationService';
import { CreateMenuItemRequest, UpdateMenuItemRequest } from '@/domain/entities/MenuItem';

export class MenuItemController {
  constructor(private menuItemService: MenuItemApplicationService) {}

  async getAllMenuItems(req: Request, res: Response): Promise<void> {
    try {
      const menuItems = await this.menuItemService.getAllMenuItems();
      const plainMenuItems = menuItems.map(item => item.toPlainObject());
      res.json(plainMenuItems);
    } catch (error) {
      res.status(500).json({ error: 'メニューアイテムの取得に失敗しました' });
    }
  }

  async getMenuItemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const menuItem = await this.menuItemService.getMenuItemById(id);
      
      if (!menuItem) {
        res.status(404).json({ error: 'メニューアイテムが見つかりません' });
        return;
      }
      
      res.json(menuItem.toPlainObject());
    } catch (error) {
      res.status(500).json({ error: 'メニューアイテムの取得に失敗しました' });
    }
  }

  async getMenuItemsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const menuItems = await this.menuItemService.getMenuItemsByCategory(category);
      const plainMenuItems = menuItems.map(item => item.toPlainObject());
      res.json(plainMenuItems);
    } catch (error) {
      res.status(500).json({ error: 'メニューアイテムの取得に失敗しました' });
    }
  }

  async createMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const menuItemData: CreateMenuItemRequest = req.body;
      const newMenuItem = await this.menuItemService.createMenuItem(menuItemData);
      res.status(201).json(newMenuItem.toPlainObject());
    } catch (error) {
      res.status(500).json({ error: 'メニューアイテムの作成に失敗しました' });
    }
  }

  async updateMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateMenuItemRequest = req.body;
      const updatedMenuItem = await this.menuItemService.updateMenuItem(id, updateData);
      
      if (!updatedMenuItem) {
        res.status(404).json({ error: 'メニューアイテムが見つかりません' });
        return;
      }
      
      res.json(updatedMenuItem.toPlainObject());
    } catch (error) {
      res.status(500).json({ error: 'メニューアイテムの更新に失敗しました' });
    }
  }

  async deleteMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.menuItemService.deleteMenuItem(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'メニューアイテムが見つかりません' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'メニューアイテムの削除に失敗しました' });
    }
  }
} 