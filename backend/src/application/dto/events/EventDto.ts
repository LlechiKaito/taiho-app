export interface EventResponseDto {
  id: number;
  photoUrl: string;
  priority: number;
}

export interface EventListResponseDto {
  events: EventResponseDto[];
  total: number;
}

// イベント作成・更新用のDTO
export interface CreateEventRequestDto {
  photoUrl: string;
  priority: number;
}

export interface UpdateEventRequestDto {
  photoUrl?: string;
  priority?: number;
}

export interface CreateEventResponseDto {
  id: number;
  photoUrl: string;
  priority: number;
} 