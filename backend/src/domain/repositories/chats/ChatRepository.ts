import { Chat } from '@/domain/entities/chats/Chat';

export interface ChatRepository {
  findAll(): Promise<Chat[]>;
  findByOrderId(orderId: number): Promise<Chat[]>;
} 