import { MenuItem } from '../entities/MenuItem';

export interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>;
} 