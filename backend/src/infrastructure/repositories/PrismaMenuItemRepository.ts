import { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest } from '@/domain/entities/MenuItem';
import { MenuItemRepository } from '@/domain/repositories/MenuItemRepository';
import { prisma } from '@/infrastructure/database/prisma';

export class PrismaMenuItemRepository implements MenuItemRepository {
  async findAll(): Promise<MenuItem[]> {
    const items = await prisma.menuItem.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    
    return items.map(this.mapPrismaToMenuItem);
  }

  async findById(id: string): Promise<MenuItem | null> {
    const item = await prisma.menuItem.findUnique({
      where: { id }
    });
    
    return item ? this.mapPrismaToMenuItem(item) : null;
  }

  async findByCategory(category: string): Promise<MenuItem[]> {
    const items = await prisma.menuItem.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    });
    
    return items.map(this.mapPrismaToMenuItem);
  }

  async create(item: CreateMenuItemRequest): Promise<MenuItem> {
    // ドメインエンティティを使用してバリデーション
    const menuItem = MenuItem.create(item);
    
    const createdItem = await prisma.menuItem.create({
      data: {
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        category: menuItem.category,
        imageUrl: menuItem.imageUrl,
        isAvailable: menuItem.isAvailable
      }
    });
    
    return this.mapPrismaToMenuItem(createdItem);
  }

  async update(id: string, item: UpdateMenuItemRequest): Promise<MenuItem | null> {
    try {
      // 既存のアイテムを取得
      const existingItem = await this.findById(id);
      if (!existingItem) {
        return null;
      }
      
      // ドメインエンティティを使用して更新とバリデーション
      existingItem.update(item);
      
      const updatedItem = await prisma.menuItem.update({
        where: { id },
        data: {
          name: existingItem.name,
          description: existingItem.description,
          price: existingItem.price,
          category: existingItem.category,
          imageUrl: existingItem.imageUrl,
          isAvailable: existingItem.isAvailable,
          updatedAt: existingItem.updatedAt
        }
      });
      
      return this.mapPrismaToMenuItem(updatedItem);
    } catch (error) {
      // レコードが見つからない場合
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.menuItem.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      // レコードが見つからない場合
      return false;
    }
  }

  private mapPrismaToMenuItem(item: any): MenuItem {
    return new MenuItem(
      item.id,
      item.name,
      item.description,
      parseFloat(item.price.toString()),
      item.category,
      item.imageUrl,
      item.isAvailable,
      item.createdAt,
      item.updatedAt
    );
  }
} 