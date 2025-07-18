import { MenuItem } from '../../domain/entities/MenuItem';
import { MenuItemRepository } from '../../domain/repositories/MenuItemRepository';
import { MenuItemApplicationService } from '../services/MenuItemApplicationService';
import {
  MenuItemResponseDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
  MenuItemListResponseDto,
  CategorySummaryDto,
  MenuItemFilterDto
} from '../dto/MenuItemDto';

export class MenuItemUseCase {
  private applicationService: MenuItemApplicationService;

  constructor(
    private menuItemRepository: MenuItemRepository
  ) {
    this.applicationService = new MenuItemApplicationService(menuItemRepository);
  }

  async getAllMenuItems(): Promise<MenuItemListResponseDto> {
    const items = await this.menuItemRepository.findAll();
    const responseItems = items.map(item => this.toResponseDto(item));
    
    return {
      items: responseItems,
      total: responseItems.length
    };
  }

  async getMenuItemById(id: string): Promise<MenuItemResponseDto | null> {
    const item = await this.menuItemRepository.findById(id);
    return item ? this.toResponseDto(item) : null;
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItemListResponseDto> {
    const items = await this.menuItemRepository.findByCategory(category);
    const responseItems = items.map(item => this.toResponseDto(item));
    
    return {
      items: responseItems,
      total: responseItems.length
    };
  }

  async getAvailableMenuItems(): Promise<MenuItemListResponseDto> {
    const allItems = await this.menuItemRepository.findAll();
    const items = MenuItem.filterAvailableItems(allItems);
    const responseItems = items.map((item: MenuItem) => this.toResponseDto(item));
    
    return {
      items: responseItems,
      total: responseItems.length
    };
  }

  async getMenuItemsByPriceRange(minPrice: number, maxPrice: number): Promise<MenuItemListResponseDto> {
    const allItems = await this.menuItemRepository.findAll();
    const items = MenuItem.filterByPriceRange(allItems, minPrice, maxPrice);
    const responseItems = items.map((item: MenuItem) => this.toResponseDto(item));
    
    return {
      items: responseItems,
      total: responseItems.length
    };
  }

  async createMenuItem(data: CreateMenuItemRequestDto): Promise<MenuItemResponseDto> {
    // Application Serviceを使用して作成
    const item = await this.applicationService.createMenuItem(data);
    return this.toResponseDto(item);
  }

  async updateMenuItem(id: string, data: UpdateMenuItemRequestDto): Promise<MenuItemResponseDto | null> {
    // Application Serviceを使用して更新
    const item = await this.applicationService.updateMenuItem(id, data);
    return item ? this.toResponseDto(item) : null;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    // Application Serviceを使用して削除
    return await this.applicationService.deleteMenuItem(id);
  }

  async getCategorySummary(): Promise<CategorySummaryDto[]> {
    const allItems = await this.menuItemRepository.findAll();
    return MenuItem.getCategorySummary(allItems);
  }

  async getFilteredMenuItems(filter: MenuItemFilterDto): Promise<MenuItemListResponseDto> {
    let items: MenuItem[];

    if (filter.category) {
      items = await this.menuItemRepository.findByCategory(filter.category);
    } else {
      items = await this.menuItemRepository.findAll();
    }

    // フィルタリング
    const filteredItems = items.filter(item => {
      if (filter.minPrice !== undefined && item.price < filter.minPrice) return false;
      if (filter.maxPrice !== undefined && item.price > filter.maxPrice) return false;
      if (filter.isAvailable !== undefined && item.isAvailable !== filter.isAvailable) return false;
      return true;
    });

    const responseItems = filteredItems.map(item => this.toResponseDto(item));
    
    return {
      items: responseItems,
      total: responseItems.length
    };
  }

  /**
   * 一括作成（新機能）
   */
  async bulkCreateMenuItems(items: CreateMenuItemRequestDto[]): Promise<MenuItemListResponseDto> {
    const createdItems = await this.applicationService.bulkCreateMenuItems(items);
    const responseItems = createdItems.map(item => this.toResponseDto(item));
    
    return {
      items: responseItems,
      total: responseItems.length
    };
  }

  /**
   * データ整合性チェック（新機能）
   */
  async validateData(): Promise<{ isValid: boolean; issues: string[] }> {
    return await this.applicationService.validateCategoryConsistency();
  }

  /**
   * クリーンアップ
   */
  async cleanup(): Promise<void> {
    await this.applicationService.cleanup();
  }

  private toResponseDto(item: MenuItem): MenuItemResponseDto {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    };
  }
} 