export interface ChatResponseDto {
  id: number;
  orderId: number;
  content: string;
}

export interface ChatListResponseDto {
  chats: ChatResponseDto[];
  total: number;
} 