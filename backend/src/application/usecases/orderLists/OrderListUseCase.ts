import { OrderList } from '@/domain/entities/orderLists/OrderList';
import { OrderListRepository } from '@/domain/repositories/orderLists/OrderListRepository';
import {
  OrderListResponseDto,
  OrderListListResponseDto,
} from '@/application/dto/orderLists/OrderListDto';

export class OrderListUseCase {
  constructor(
    private orderListRepository: OrderListRepository
  ) {}

  async getAllOrderLists(): Promise<OrderListListResponseDto> {
    const orderLists = await this.orderListRepository.findAll();
    const responseOrderLists = orderLists.map(orderList => this.toResponseDto(orderList));
    
    return {
      orderLists: responseOrderLists,
      total: responseOrderLists.length
    };
  }

  private toResponseDto(orderList: OrderList): OrderListResponseDto {
    return {
      id: orderList.id,
      orderId: orderList.orderId,
      itemId: orderList.itemId,
      quantity: orderList.quantity
    };
  }
} 