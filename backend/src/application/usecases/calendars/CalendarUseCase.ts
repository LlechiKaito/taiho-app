import { Calendar } from '@/domain/entities/calendars/Calendar';
import { CalendarRepository } from '@/domain/repositories/calendars/CalendarRepository';
import {
  CalendarResponseDto,
  CalendarListResponseDto,
  CreateCalendarRequestDto,
  UpdateCalendarRequestDto,
  CreateCalendarResponseDto,
} from '@/application/dto/calendars/CalendarDto';

export class CalendarUseCase {
  constructor(
    private calendarRepository: CalendarRepository
  ) {}

  async getAllCalendars(): Promise<CalendarListResponseDto> {
    const calendars = await this.calendarRepository.findAll();
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
    const filtered = calendars.filter(calendar => calendar.timestamp >= firstOfMonth);
    const responseCalendars = filtered.map(calendar => this.toResponseDto(calendar));
    return {
      calendars: responseCalendars,
      total: responseCalendars.length
    };
  }

  async getCalendarById(id: number): Promise<CalendarResponseDto | null> {
    const calendar = await this.calendarRepository.findById(id);
    return calendar ? this.toResponseDto(calendar) : null;
  }

  async createCalendar(request: CreateCalendarRequestDto): Promise<CreateCalendarResponseDto> {
    // バリデーション
    if (!request.photoUrl || !request.timestamp) {
      throw new Error('photoUrlとtimestampは必須です');
    }

    // 同じ月に既にカレンダーが存在するかチェック
    const calendarDate = new Date(request.timestamp);
    const existingCalendars = await this.calendarRepository.findByMonth(
      calendarDate.getFullYear(),
      calendarDate.getMonth()
    );
    
    if (existingCalendars.length > 0) {
      throw new Error('同じ月に既にカレンダーが存在します');
    }

    const calendar = await this.calendarRepository.create({
      photoUrl: request.photoUrl,
      timestamp: request.timestamp
    });

    return this.toCreateResponseDto(calendar);
  }

  async updateCalendar(id: number, request: UpdateCalendarRequestDto): Promise<CalendarResponseDto | null> {
    // バリデーション
    if (!request.photoUrl && request.timestamp === undefined) {
      throw new Error('更新する項目を指定してください');
    }

    // 既存のカレンダーを取得
    const existingCalendar = await this.calendarRepository.findById(id);
    if (!existingCalendar) {
      return null;
    }

    // 更新データを準備
    const updateData: { photoUrl?: string; timestamp?: number } = {};
    if (request.photoUrl !== undefined) {
      updateData.photoUrl = request.photoUrl;
    }
    if (request.timestamp !== undefined) {
      updateData.timestamp = request.timestamp;
    }

    // timestampが更新される場合、同じ月に別のカレンダーが存在するかチェック
    if (request.timestamp !== undefined) {
      const calendarDate = new Date(request.timestamp);
      const existingCalendars = await this.calendarRepository.findByMonth(
        calendarDate.getFullYear(),
        calendarDate.getMonth()
      );
      
      // 自分以外のカレンダーが同じ月に存在するかチェック
      const otherCalendars = existingCalendars.filter(cal => cal.id !== id);
      if (otherCalendars.length > 0) {
        throw new Error('同じ月に既に別のカレンダーが存在します');
      }
    }

    const calendar = await this.calendarRepository.update(id, updateData);
    return calendar ? this.toResponseDto(calendar) : null;
  }

  private toResponseDto(calendar: Calendar): CalendarResponseDto {
    const date = new Date(calendar.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return {
      id: calendar.id,
      photoUrl: calendar.photoUrl,
      yearMonth: `${year}-${month}`
    };
  }

  private toCreateResponseDto(calendar: Calendar): CreateCalendarResponseDto {
    const date = new Date(calendar.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return {
      id: calendar.id,
      photoUrl: calendar.photoUrl,
      yearMonth: `${year}-${month}`
    };
  }
} 