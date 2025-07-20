import { MenuItemRepository } from '@/domain/repositories/MenuItemRepository';
import { MenuItemUseCase } from '@/application/usecases/MenuItemUseCase';
import {
  MenuItemListResponseDto,
} from '@/application/dto/MenuItemDto';

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
} 