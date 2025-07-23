export interface CalendarResponseDto {
  id: number;
  photoUrl: string;
  yearMonth: string;
}

export interface CalendarListResponseDto {
  calendars: CalendarResponseDto[];
  total: number;
}

// カレンダー作成・更新用のDTO
export interface CreateCalendarRequestDto {
  photoUrl: string;
  timestamp: number;
}

export interface UpdateCalendarRequestDto {
  photoUrl?: string;
  timestamp?: number;
}

export interface CreateCalendarResponseDto {
  id: number;
  photoUrl: string;
  yearMonth: string;
} 