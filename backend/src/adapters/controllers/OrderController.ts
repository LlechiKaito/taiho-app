import { Request, Response } from 'express';
import { OrderApplicationService } from '@/application/services/OrderApplicationService';

export class OrderController {
  constructor(private orderApplicationService: OrderApplicationService) {}

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.orderApplicationService.getAllOrders();
      res.json(result);
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({ 
        error: '注文の取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 