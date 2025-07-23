import { Event } from '@/domain/entities/events/Event';

export interface EventRepository {
  findAll(): Promise<Event[]>;
  findById(id: number): Promise<Event | null>;
  create(event: Omit<Event, 'id'>): Promise<Event>;
  update(id: number, event: Partial<Omit<Event, 'id'>>): Promise<Event | null>;
  delete(id: number): Promise<boolean>;
} 