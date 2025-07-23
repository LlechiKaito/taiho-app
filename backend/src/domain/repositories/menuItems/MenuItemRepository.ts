import { MenuItem } from '../../entities/menuItems/MenuItem';

export interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>;
} 