import { Router } from 'express';
import { OrderController } from '@/adapters/controllers/orders/OrderController';

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  router.get('/api/orders', (req, res) => controller.getAllOrders(req, res));
  router.get('/api/orders/:id', (req, res) => controller.getOrderById(req, res));
  router.post('/api/orders', (req, res) => controller.createOrder(req, res));

  return router;
}; 