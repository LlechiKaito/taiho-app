import { Router } from 'express';
import { MenuItemController } from '../controllers/MenuItemController';

export const createMenuItemRoutes = (controller: MenuItemController): Router => {
  const router = Router();

  // GET /items - 全メニューアイテム取得
  router.get('/items', (req, res) => controller.getAllMenuItems(req, res));

  // POST /items - メニューアイテム作成
  router.post('/items', (req, res) => controller.createMenuItem(req, res));

  return router;
}; 