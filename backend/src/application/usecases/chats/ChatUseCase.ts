import { Chat } from '@/domain/entities/chats/Chat';
import { ChatRepository } from '@/domain/repositories/chats/ChatRepository';
import {
  ChatResponseDto,
  ChatListResponseDto,
} from '@/application/dto/chats/ChatDto';

export class ChatUseCase {
  constructor(
    private chatRepository: ChatRepository
  ) {}

  async getAllChats(): Promise<ChatListResponseDto> {
    const chats = await this.chatRepository.findAll();
    const responseChats = chats.map(chat => this.toResponseDto(chat));
    
    return {
      chats: responseChats,
      total: responseChats.length
    };
  }

  private toResponseDto(chat: Chat): ChatResponseDto {
    return {
      id: chat.id,
      orderId: chat.orderId,
      content: chat.content
    };
  }
} 