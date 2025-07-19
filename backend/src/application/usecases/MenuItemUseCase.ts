import { MenuItem } from '../../domain/entities/MenuItem';
import { MenuItemRepository } from '../../domain/repositories/MenuItemRepository';
import {
  MenuItemResponseDto,
  CreateMenuItemRequestDto,
  MenuItemListResponseDto,
} from '../dto/MenuItemDto';

export class MenuItemUseCase {
  constructor(
    private menuItemRepository: MenuItemRepository
  ) {}

  async getAllMenuItems(): Promise<MenuItemListResponseDto> {
    const items = await this.menuItemRepository.findAll();
    const responseItems = items.map(item => this.toResponseDto(item));
    
    return {
      items: responseItems,
      total: responseItems.length
    };
  }

  async createMenuItem(data: CreateMenuItemRequestDto): Promise<MenuItemResponseDto> {
    // UseCase層で直接ビジネスロジックを実行
    try {
      // エンティティの静的バリデーションメソッドを使用
      MenuItem.validateCreateData(data);
      
      // 重複チェック
      const existingItems = await this.menuItemRepository.findAll();
      MenuItem.validateDuplicateName(data.name, data.category, existingItems);
      
      // リポジトリを通じてデータを永続化
      const item = await this.menuItemRepository.create(data);
      
      console.log(`✅ メニューアイテム作成: ${item.name} (ID: ${item.id})`);
      return this.toResponseDto(item);
    } catch (error) {
      console.error('❌ メニューアイテム作成エラー:', error);
      throw error;
    }
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