import { OrderRepository } from '@/domain/repositories/orders/OrderRepository';
import { OrderListRepository } from '@/domain/repositories/orderLists/OrderListRepository';
import { OrderUseCase } from '@/application/usecases/orders/OrderUseCase';
import {
  OrderListResponseDto,
  OrderDetailResponseDto,
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from '@/application/dto/orders/OrderDto';

export class OrderApplicationService {
  private orderUseCase: OrderUseCase;

  constructor(
    private orderRepository: OrderRepository,
    private orderListRepository: OrderListRepository
  ) {
    this.orderUseCase = new OrderUseCase(orderRepository, orderListRepository);
  }

  /**
   * 注文一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllOrders(): Promise<OrderListResponseDto> {
    return await this.orderUseCase.getAllOrders();
  }

  /**
   * 注文詳細の取得
   */
  async getOrderById(id: number): Promise<OrderDetailResponseDto | null> {
    return await this.orderUseCase.getOrderById(id);
  }

  /**
   * 注文の作成
   */
  async createOrder(request: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    return await this.orderUseCase.createOrder(request);
  }
} 