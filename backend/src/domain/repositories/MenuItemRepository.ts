import { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest } from '@/domain/entities/MenuItem';

export interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  findByCategory(category: string): Promise<MenuItem[]>;
  create(item: CreateMenuItemRequest): Promise<MenuItem>;
  update(id: string, item: UpdateMenuItemRequest): Promise<MenuItem | null>;
  delete(id: string): Promise<boolean>;
} 