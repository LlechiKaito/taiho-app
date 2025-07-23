import { MenuItem } from '@/domain/entities/menuItems/MenuItem';
import { MenuItemRepository } from '@/domain/repositories/menuItems/MenuItemRepository';
import items from '@/infrastructure/datas/menuItems/MenuItemStore';

export class MockMenuItemRepository implements MenuItemRepository {
  async findAll(): Promise<MenuItem[]> {
    // MenuItemStore.tsからデータを取得
    return items;
  }
} 