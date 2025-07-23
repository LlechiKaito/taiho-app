import { Order } from '../../entities/orders/Order';

export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  create(order: Omit<Order, 'id'>): Promise<Order>;
} 