import { Order } from '@/domain/entities/Order';
import { OrderRepository } from '@/domain/repositories/OrderRepository';
import {
  OrderResponseDto,
  OrderListResponseDto,
} from '@/application/dto/OrderDto';

export class OrderUseCase {
  constructor(
    private orderRepository: OrderRepository
  ) {}

  async getAllOrders(): Promise<OrderListResponseDto> {
    const orders = await this.orderRepository.findAll();
    const responseOrders = orders.map(order => this.toResponseDto(order));
    
    return {
      orders: responseOrders,
    };
  }

  private toResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      isCooked: order.isCooked,
      isPayment: order.isPayment,
      isTakeOut: order.isTakeOut,
      createdAt: order.createdAt.toISOString(),
      description: order.description,
      isComplete: order.isComplete
    };
  }
} 