import { Request, Response } from 'express';
import { OrderListApplicationService } from '@/application/services/orderLists/OrderListApplicationService';
import { OrderListRepository } from '@/domain/repositories/orderLists/OrderListRepository';

export class OrderListController {
  private orderListApplicationService: OrderListApplicationService;

  constructor(
    private orderListRepository: OrderListRepository
  ) {
    this.orderListApplicationService = new OrderListApplicationService(orderListRepository);
  }

  /**
   * 注文明細一覧の取得
   */
  async getAllOrderLists(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.orderListApplicationService.getAllOrderLists();
      if (result.orderLists.length === 0) {
        res.status(404).json({ error: '注文明細が見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
} 