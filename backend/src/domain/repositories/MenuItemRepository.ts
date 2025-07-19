import { MenuItem, CreateMenuItemData } from '../entities/MenuItem';

export interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>;
  create(data: CreateMenuItemData): Promise<MenuItem>;
} 