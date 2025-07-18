import { MenuItem, CreateMenuItemData, UpdateMenuItemData } from '../entities/MenuItem';

export interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  findByCategory(category: string): Promise<MenuItem[]>;
  create(data: CreateMenuItemData): Promise<MenuItem>;
  update(id: string, data: UpdateMenuItemData): Promise<MenuItem | null>;
  delete(id: string): Promise<boolean>;
} 