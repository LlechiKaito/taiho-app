import { Router } from 'express';
import { MenuItemController } from '@/interfaces/controllers/MenuItemController';

export function createMenuItemRoutes(menuItemController: MenuItemController): Router {
  const router = Router();

  // メニューアイテムの取得
  router.get('/', (req, res) => menuItemController.getAllMenuItems(req, res));
  
  // カテゴリ別メニューアイテムの取得
  router.get('/category/:category', (req, res) => menuItemController.getMenuItemsByCategory(req, res));
  
  // 特定のメニューアイテムの取得
  router.get('/:id', (req, res) => menuItemController.getMenuItemById(req, res));
  
  // メニューアイテムの作成
  router.post('/', (req, res) => menuItemController.createMenuItem(req, res));
  
  // メニューアイテムの更新
  router.put('/:id', (req, res) => menuItemController.updateMenuItem(req, res));
  
  // メニューアイテムの削除
  router.delete('/:id', (req, res) => menuItemController.deleteMenuItem(req, res));

  return router;
} 