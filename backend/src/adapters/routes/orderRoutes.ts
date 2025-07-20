import { Router } from 'express';
import { OrderController } from '@/adapters/controllers/OrderController';

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  router.get('/api/orders', (req, res) => controller.getAllOrders(req, res));

  return router;
}; 