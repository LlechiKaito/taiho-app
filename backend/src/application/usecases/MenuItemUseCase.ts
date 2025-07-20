import { MenuItem } from '@/domain/entities/MenuItem';
import { MenuItemRepository } from '@/domain/repositories/MenuItemRepository';
import {
  MenuItemResponseDto,
  MenuItemListResponseDto,
} from '@/application/dto/MenuItemDto';

export class MenuItemUseCase {
  constructor(
    private menuItemRepository: MenuItemRepository
  ) {}

  async getAllMenuItems(): Promise<MenuItemListResponseDto> {
    const items = await this.menuItemRepository.findAll();
    const responseItems = items.map(item => this.toResponseDto(item));
    
    return {
      items: responseItems,
    };
  }

  private toResponseDto(item: MenuItem): MenuItemResponseDto {
    return {
      id: item.id,
      name: item.name,
      photoUrl: item.photoUrl,
      description: item.description,
      price: item.price,
      category: item.category
    };
  }
} 