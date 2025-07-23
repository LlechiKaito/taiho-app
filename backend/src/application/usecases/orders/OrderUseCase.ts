import { Order } from '@/domain/entities/orders/Order';
import { OrderRepository } from '@/domain/repositories/orders/OrderRepository';
import { OrderListRepository } from '@/domain/repositories/orderLists/OrderListRepository';
import {
  OrderResponseDto,
  OrderDetailResponseDto,
  OrderListResponseDto,
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from '@/application/dto/orders/OrderDto';

export class OrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderListRepository: OrderListRepository
  ) {}

  async getAllOrders(): Promise<OrderListResponseDto> {
    const orders = await this.orderRepository.findAll();
    const responseOrders = orders.map(order => this.toResponseDto(order));
    
    return {
      orders: responseOrders,
    };
  }

  async getOrderById(id: number): Promise<OrderDetailResponseDto | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      return null;
    }

    // 注文明細を取得
    const orderLists = await this.orderListRepository.findByOrderId(id);

    return {
      ...this.toResponseDto(order),
      orderLists: orderLists.map(orderList => ({
        id: orderList.id,
        orderId: orderList.orderId,
        itemId: orderList.itemId,
        quantity: orderList.quantity
      }))
    };
  }

  async createOrder(request: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    // 注文を作成
    const order = await this.orderRepository.create({
      userId: request.userId,
      isCooked: false,
      isPayment: false,
      isTakeOut: request.isTakeOut,
      createdAt: new Date(),
      description: this.generateDescription(request.itemList),
      isComplete: false
    });

    // 注文明細を作成
    const orderLists = [];
    for (const item of request.itemList) {
      const orderList = await this.orderListRepository.create({
        orderId: order.id,
        itemId: item.itemId,
        quantity: item.quantity
      });
      orderLists.push(orderList);
    }

    return {
      ...this.toResponseDto(order),
      orderLists: orderLists.map(orderList => ({
        id: orderList.id,
        orderId: orderList.orderId,
        itemId: orderList.itemId,
        quantity: orderList.quantity
      }))
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

  private generateDescription(itemList: { itemId: number; quantity: number }[]): string {
    // 簡易的な説明生成（実際の実装では商品名を取得する必要があります）
    return itemList.map(item => `商品${item.itemId} x${item.quantity}`).join(', ');
  }
} 