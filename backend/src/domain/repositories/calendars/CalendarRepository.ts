import { Calendar } from '@/domain/entities/calendars/Calendar';

export interface CalendarRepository {
  findAll(): Promise<Calendar[]>;
  findById(id: number): Promise<Calendar | null>;
  findByMonth(year: number, month: number): Promise<Calendar[]>;
  create(calendar: Omit<Calendar, 'id'>): Promise<Calendar>;
  update(id: number, calendar: Partial<Omit<Calendar, 'id'>>): Promise<Calendar | null>;
} 