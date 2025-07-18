import { Router } from 'express';
import { MenuItemController } from '../controllers/MenuItemController';

export const createMenuItemRoutes = (controller: MenuItemController): Router => {
  const router = Router();

  // GET /items - 全メニューアイテム取得
  router.get('/items', (req, res) => controller.getAllMenuItems(req, res));

  // GET /items/:id - ID指定でメニューアイテム取得
  router.get('/items/:id', (req, res) => controller.getMenuItemById(req, res));

  // GET /items/category/:category - カテゴリ別メニューアイテム取得
  router.get('/items/category/:category', (req, res) => controller.getMenuItemsByCategory(req, res));

  // GET /items/available - 利用可能なメニューアイテム取得
  router.get('/items/available', (req, res) => controller.getAvailableMenuItems(req, res));

  // GET /items/filter - フィルタリングされたメニューアイテム取得
  router.get('/items/filter', (req, res) => controller.getFilteredMenuItems(req, res));

  // GET /items/summary/category - カテゴリ別統計取得
  router.get('/items/summary/category', (req, res) => controller.getCategorySummary(req, res));

  // POST /items - メニューアイテム作成
  router.post('/items', (req, res) => controller.createMenuItem(req, res));

  // PUT /items/:id - メニューアイテム更新
  router.put('/items/:id', (req, res) => controller.updateMenuItem(req, res));

  // DELETE /items/:id - メニューアイテム削除
  router.delete('/items/:id', (req, res) => controller.deleteMenuItem(req, res));

  return router;
}; 