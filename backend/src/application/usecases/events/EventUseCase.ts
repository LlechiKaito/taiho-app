import { Event } from '@/domain/entities/events/Event';
import { EventRepository } from '@/domain/repositories/events/EventRepository';
import {
  EventResponseDto,
  EventListResponseDto,
  CreateEventRequestDto,
  UpdateEventRequestDto,
  CreateEventResponseDto,
} from '@/application/dto/events/EventDto';

export class EventUseCase {
  constructor(
    private eventRepository: EventRepository
  ) {}

  async getAllEvents(): Promise<EventListResponseDto> {
    const events = await this.eventRepository.findAll();
    const responseEvents = events.map(event => this.toResponseDto(event));
    
    return {
      events: responseEvents,
      total: responseEvents.length
    };
  }

  async getEventById(id: number): Promise<EventResponseDto | null> {
    const event = await this.eventRepository.findById(id);
    return event ? this.toResponseDto(event) : null;
  }

  async createEvent(request: CreateEventRequestDto): Promise<CreateEventResponseDto> {
    // バリデーション
    if (!request.photoUrl || request.priority === undefined) {
      throw new Error('photoUrlとpriorityは必須です');
    }

    const event = await this.eventRepository.create({
      photoUrl: request.photoUrl,
      priority: request.priority
    });

    return this.toCreateResponseDto(event);
  }

  async updateEvent(id: number, request: UpdateEventRequestDto): Promise<EventResponseDto | null> {
    // バリデーション
    if (!request.photoUrl && request.priority === undefined) {
      throw new Error('更新する項目を指定してください');
    }

    const updateData: { photoUrl?: string; priority?: number } = {};
    if (request.photoUrl !== undefined) {
      updateData.photoUrl = request.photoUrl;
    }
    if (request.priority !== undefined) {
      updateData.priority = request.priority;
    }

    const event = await this.eventRepository.update(id, updateData);
    return event ? this.toResponseDto(event) : null;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return await this.eventRepository.delete(id);
  }

  private toResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      photoUrl: event.photoUrl,
      priority: event.priority
    };
  }

  private toCreateResponseDto(event: Event): CreateEventResponseDto {
    return {
      id: event.id,
      photoUrl: event.photoUrl,
      priority: event.priority
    };
  }
} 