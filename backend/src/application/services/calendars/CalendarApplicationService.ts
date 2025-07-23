import { CalendarRepository } from '@/domain/repositories/calendars/CalendarRepository';
import { CalendarUseCase } from '@/application/usecases/calendars/CalendarUseCase';
import {
  CalendarResponseDto,
  CalendarListResponseDto,
  CreateCalendarRequestDto,
  UpdateCalendarRequestDto,
  CreateCalendarResponseDto,
} from '@/application/dto/calendars/CalendarDto';

export class CalendarApplicationService {
  private calendarUseCase: CalendarUseCase;

  constructor(
    private calendarRepository: CalendarRepository
  ) {
    this.calendarUseCase = new CalendarUseCase(calendarRepository);
  }

  /**
   * カレンダー一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllCalendars(): Promise<CalendarListResponseDto> {
    return await this.calendarUseCase.getAllCalendars();
  }

  /**
   * カレンダー詳細の取得
   */
  async getCalendarById(id: number): Promise<CalendarResponseDto | null> {
    return await this.calendarUseCase.getCalendarById(id);
  }

  /**
   * カレンダーの作成
   */
  async createCalendar(request: CreateCalendarRequestDto): Promise<CreateCalendarResponseDto> {
    return await this.calendarUseCase.createCalendar(request);
  }

  /**
   * カレンダーの更新
   */
  async updateCalendar(id: number, request: UpdateCalendarRequestDto): Promise<CalendarResponseDto | null> {
    return await this.calendarUseCase.updateCalendar(id, request);
  }
} 