import { Router } from 'express';
import { OrderListController } from '@/adapters/controllers/orderLists/OrderListController';
import { DynamoDBOrderListRepository } from '@/infrastructure/repositories/orderLists/DynamoDBOrderListRepository';

const router = Router();
const orderListRepository = new DynamoDBOrderListRepository();
const orderListController = new OrderListController(orderListRepository);

router.get('/api/order-lists', (req, res) => orderListController.getAllOrderLists(req, res));

export default router; 