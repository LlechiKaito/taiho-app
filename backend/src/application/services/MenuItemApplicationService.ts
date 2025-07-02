import { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest } from '@/domain/entities/MenuItem';
import { MenuItemRepository } from '@/domain/repositories/MenuItemRepository';

export class MenuItemApplicationService {
  constructor(private menuItemRepository: MenuItemRepository) {}

  // 基本CRUD操作
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await this.menuItemRepository.findAll();
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    return await this.menuItemRepository.findById(id);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await this.menuItemRepository.findByCategory(category);
  }

  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    return await this.menuItemRepository.create(data);
  }

  async updateMenuItem(id: string, data: UpdateMenuItemRequest): Promise<MenuItem | null> {
    return await this.menuItemRepository.update(id, data);
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return await this.menuItemRepository.delete(id);
  }

  // ドメインロジックを活用した高度な操作
  async getAvailableMenuItems(): Promise<MenuItem[]> {
    const allItems = await this.menuItemRepository.findAll();
    return allItems.filter(item => item.isAvailable);
  }

  async searchMenuItems(searchTerm: string): Promise<MenuItem[]> {
    const allItems = await this.menuItemRepository.findAll();
    return allItems.filter(item => item.matchesSearch(searchTerm));
  }

  async getMenuItemsWithDiscount(discountRate: number): Promise<Array<{ item: MenuItem; discountedPrice: number }>> {
    const allItems = await this.menuItemRepository.findAll();
    return allItems
      .filter(item => item.isAvailable)
      .map(item => ({
        item,
        discountedPrice: item.calculateDiscountedPrice(discountRate)
      }));
  }

  async getMenuItemsByPriceRange(range: 'low' | 'medium' | 'high'): Promise<MenuItem[]> {
    const allItems = await this.menuItemRepository.findAll();
    return allItems.filter(item => item.getPriceRange() === range);
  }

  async getSortedMenuItemsByCategory(): Promise<MenuItem[]> {
    const allItems = await this.menuItemRepository.findAll();
    return allItems.sort((a, b) => {
      const categoryOrder = a.getCategoryOrder() - b.getCategoryOrder();
      if (categoryOrder !== 0) return categoryOrder;
      return a.name.localeCompare(b.name);
    });
  }

  async makeMenuItemAvailable(id: string): Promise<MenuItem | null> {
    const item = await this.menuItemRepository.findById(id);
    if (!item) return null;

    item.makeAvailable();
    return await this.menuItemRepository.update(id, {
      isAvailable: item.isAvailable
    });
  }

  async makeMenuItemUnavailable(id: string): Promise<MenuItem | null> {
    const item = await this.menuItemRepository.findById(id);
    if (!item) return null;

    item.makeUnavailable();
    return await this.menuItemRepository.update(id, {
      isAvailable: item.isAvailable
    });
  }

  async getMenuWithTaxIncluded(taxRate: number = 0.1): Promise<Array<{ item: MenuItem; taxIncludedPrice: number }>> {
    const allItems = await this.menuItemRepository.findAll();
    return allItems.map(item => ({
      item,
      taxIncludedPrice: item.calculateTaxIncludedPrice(taxRate)
    }));
  }

  async validateAndUpdatePrice(id: string, newPrice: number): Promise<MenuItem | null> {
    const item = await this.menuItemRepository.findById(id);
    if (!item) return null;

    try {
      // ドメインエンティティのバリデーションを使用
      item.price = newPrice;
      return await this.menuItemRepository.update(id, {
        price: item.price
      });
    } catch (error) {
      throw new Error(`価格更新エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }
} 