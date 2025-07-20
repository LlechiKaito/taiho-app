import { Router } from 'express';
import { MenuItemController } from '@/adapters/controllers/MenuItemController';

export const createMenuItemRoutes = (controller: MenuItemController): Router => {
  const router = Router();

  router.get('/api/items', (req, res) => controller.getAllMenuItems(req, res));

  return router;
}; 