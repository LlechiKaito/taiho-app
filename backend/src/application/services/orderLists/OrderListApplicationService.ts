import { OrderListRepository } from '@/domain/repositories/orderLists/OrderListRepository';
import { OrderListUseCase } from '@/application/usecases/orderLists/OrderListUseCase';
import {
  OrderListListResponseDto,
} from '@/application/dto/orderLists/OrderListDto';

export class OrderListApplicationService {
  private orderListUseCase: OrderListUseCase;

  constructor(
    private orderListRepository: OrderListRepository
  ) {
    this.orderListUseCase = new OrderListUseCase(orderListRepository);
  }

  /**
   * 注文明細一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllOrderLists(): Promise<OrderListListResponseDto> {
    return await this.orderListUseCase.getAllOrderLists();
  }
} 