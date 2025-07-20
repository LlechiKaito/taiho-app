import { MenuItem } from '@/domain/entities/MenuItem';
import { MenuItemRepository } from '@/domain/repositories/MenuItemRepository';
import items from '@/infrastructure/datas/MenuItemStore';

export class MockMenuItemRepository implements MenuItemRepository {
  async findAll(): Promise<MenuItem[]> {
    // MenuItemStore.tsからデータを取得
    return items;
  }
} 