import { Router } from 'express';
import { MenuItemController } from '@/adapters/controllers/menuItems/MenuItemController';

export const createMenuItemRoutes = (controller: MenuItemController): Router => {
  const router = Router();

  router.get('/api/items', (req, res) => controller.getAllMenuItems(req, res));

  return router;
}; 