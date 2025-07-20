import { OrderRepository } from '@/domain/repositories/OrderRepository';
import { OrderUseCase } from '@/application/usecases/OrderUseCase';
import {
  OrderListResponseDto,
} from '@/application/dto/OrderDto';

export class OrderApplicationService {
  private orderUseCase: OrderUseCase;

  constructor(
    private orderRepository: OrderRepository
  ) {
    this.orderUseCase = new OrderUseCase(orderRepository);
  }

  /**
   * 注文一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllOrders(): Promise<OrderListResponseDto> {
    return await this.orderUseCase.getAllOrders();
  }
} 