import { OrderList } from '@/domain/entities/orderLists/OrderList';

export interface OrderListRepository {
  findAll(): Promise<OrderList[]>;
  findByOrderId(orderId: number): Promise<OrderList[]>;
  create(orderList: Omit<OrderList, 'id'>): Promise<OrderList>;
} 