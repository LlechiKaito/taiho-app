import { EventRepository } from '@/domain/repositories/events/EventRepository';
import { EventUseCase } from '@/application/usecases/events/EventUseCase';
import {
  EventResponseDto,
  EventListResponseDto,
  CreateEventRequestDto,
  UpdateEventRequestDto,
  CreateEventResponseDto,
} from '@/application/dto/events/EventDto';

export class EventApplicationService {
  private eventUseCase: EventUseCase;

  constructor(
    private eventRepository: EventRepository
  ) {
    this.eventUseCase = new EventUseCase(eventRepository);
  }

  /**
   * イベント一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllEvents(): Promise<EventListResponseDto> {
    return await this.eventUseCase.getAllEvents();
  }

  /**
   * イベント詳細の取得
   */
  async getEventById(id: number): Promise<EventResponseDto | null> {
    return await this.eventUseCase.getEventById(id);
  }

  /**
   * イベントの作成
   */
  async createEvent(request: CreateEventRequestDto): Promise<CreateEventResponseDto> {
    return await this.eventUseCase.createEvent(request);
  }

  /**
   * イベントの更新
   */
  async updateEvent(id: number, request: UpdateEventRequestDto): Promise<EventResponseDto | null> {
    return await this.eventUseCase.updateEvent(id, request);
  }

  /**
   * イベントの削除
   */
  async deleteEvent(id: number): Promise<boolean> {
    return await this.eventUseCase.deleteEvent(id);
  }
} 