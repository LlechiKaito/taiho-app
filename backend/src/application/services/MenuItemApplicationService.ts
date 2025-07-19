import { MenuItem } from '../../domain/entities/MenuItem';
import { MenuItemRepository } from '../../domain/repositories/MenuItemRepository';
import { MenuItemUseCase } from '../usecases/MenuItemUseCase';
import {
  MenuItemResponseDto,
  CreateMenuItemRequestDto,
  MenuItemListResponseDto,
} from '../dto/MenuItemDto';

export class MenuItemApplicationService {
  private menuItemUseCase: MenuItemUseCase;

  constructor(
    private menuItemRepository: MenuItemRepository
  ) {
    this.menuItemUseCase = new MenuItemUseCase(menuItemRepository);
  }

  /**
   * メニューアイテム一覧の取得
   * Application Service層でUseCaseを呼び出し
   */
  async getAllMenuItems(): Promise<MenuItemListResponseDto> {
    return await this.menuItemUseCase.getAllMenuItems();
  }

  /**
   * メニューアイテムの作成
   * Application Service層でUseCaseを呼び出し
   * トランザクション管理とビジネスロジックの調整を行う
   */
  async createMenuItem(data: CreateMenuItemRequestDto): Promise<MenuItemResponseDto> {
    return await this.menuItemUseCase.createMenuItem(data);
  }
} 