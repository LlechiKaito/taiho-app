import { Order } from '../entities/Order';

export interface OrderRepository {
  findAll(): Promise<Order[]>;
} 