import { Request, Response } from 'express';
import { OrderApplicationService } from '@/application/services/orders/OrderApplicationService';
import { CreateOrderRequestDto } from '@/application/dto/orders/OrderDto';

export class OrderController {
  constructor(private orderApplicationService: OrderApplicationService) {}

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.orderApplicationService.getAllOrders();
      if (result.orders.length === 0) {
        res.status(404).json({ error: '注文が見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({ 
        error: '注文の取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: '注文IDは数値である必要があります' });
        return;
      }
      
      const result = await this.orderApplicationService.getOrderById(id);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: '注文が見つかりません' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const request: CreateOrderRequestDto = req.body;

      // バリデーション
      if (!request.userId || !request.itemList || request.itemList.length === 0) {
        res.status(400).json({ error: 'ユーザーIDと商品リストは必須です' });
        return;
      }

      const result = await this.orderApplicationService.createOrder(request);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: '注文の作成に失敗しました' });
      }
    }
  }
} 