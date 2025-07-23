import { ChatRepository } from '@/domain/repositories/chats/ChatRepository';
import { ChatUseCase } from '@/application/usecases/chats/ChatUseCase';
import {
  ChatListResponseDto,
} from '@/application/dto/chats/ChatDto';

export class ChatApplicationService {
  private chatUseCase: ChatUseCase;

  constructor(
    private chatRepository: ChatRepository
  ) {
    this.chatUseCase = new ChatUseCase(chatRepository);
  }

  /**
   * チャット一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllChats(): Promise<ChatListResponseDto> {
    return await this.chatUseCase.getAllChats();
  }
} 