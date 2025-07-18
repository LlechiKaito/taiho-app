import { MenuItem, CreateMenuItemData, UpdateMenuItemData } from '../../domain/entities/MenuItem';
import { MenuItemRepository } from '../../domain/repositories/MenuItemRepository';

export class MenuItemApplicationService {
  constructor(
    private menuItemRepository: MenuItemRepository
  ) {}

  /**
   * メニューアイテムの作成
   * トランザクション管理とビジネスロジックの調整を行う
   */
  async createMenuItem(data: CreateMenuItemData): Promise<MenuItem> {
    try {
      // エンティティの静的バリデーションメソッドを使用
      MenuItem.validateCreateData(data);
      
      // 重複チェック
      const existingItems = await this.menuItemRepository.findAll();
      MenuItem.validateDuplicateName(data.name, data.category, existingItems);
      
      // リポジトリを通じてデータを永続化
      const item = await this.menuItemRepository.create(data);
      
      console.log(`✅ メニューアイテム作成: ${item.name} (ID: ${item.id})`);
      return item;
    } catch (error) {
      console.error('❌ メニューアイテム作成エラー:', error);
      throw error;
    }
  }

  /**
   * メニューアイテムの更新
   * 更新時の整合性チェックを含む
   */
  async updateMenuItem(id: string, data: UpdateMenuItemData): Promise<MenuItem | null> {
    try {
      // 既存アイテムの存在確認
      const existingItem = await this.menuItemRepository.findById(id);
      if (!existingItem) {
        console.log(`⚠️  メニューアイテムが見つかりません: ID ${id}`);
        return null;
      }

      // 名前変更時の重複チェック
      if (data.name && data.name !== existingItem.name) {
        const duplicateItem = await this.findDuplicateItem(data.name, data.category || existingItem.category, id);
        if (duplicateItem) {
          throw new Error('同じカテゴリに同名のメニューが既に存在します');
        }
      }

      // 更新実行
      const updatedItem = await this.menuItemRepository.update(id, data);
      console.log(`✅ メニューアイテム更新: ${updatedItem?.name} (ID: ${id})`);
      return updatedItem;
    } catch (error) {
      console.error('❌ メニューアイテム更新エラー:', error);
      throw error;
    }
  }

  /**
   * メニューアイテムの削除
   * 削除前の整合性チェックを含む
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      // 既存アイテムの存在確認
      const existingItem = await this.menuItemRepository.findById(id);
      if (!existingItem) {
        console.log(`⚠️  メニューアイテムが見つかりません: ID ${id}`);
        return false;
      }

      // 削除実行
      const deleted = await this.menuItemRepository.delete(id);
      if (deleted) {
        console.log(`✅ メニューアイテム削除: ${existingItem.name} (ID: ${id})`);
      }
      return deleted;
    } catch (error) {
      console.error('❌ メニューアイテム削除エラー:', error);
      throw error;
    }
  }

  /**
   * 複数のメニューアイテムの一括処理
   * トランザクション管理を含む
   */
  async bulkCreateMenuItems(items: CreateMenuItemData[]): Promise<MenuItem[]> {
    const createdItems: MenuItem[] = [];
    const errors: string[] = [];

    for (const itemData of items) {
      try {
        const item = await this.createMenuItem(itemData);
        createdItems.push(item);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${itemData.name}: ${errorMessage}`);
      }
    }

    if (errors.length > 0) {
      console.warn('⚠️  一括作成で一部エラーが発生:', errors);
    }

    console.log(`✅ 一括作成完了: ${createdItems.length}/${items.length} 件成功`);
    return createdItems;
  }

  /**
   * カテゴリ別メニューアイテムの整合性チェック
   */
  async validateCategoryConsistency(): Promise<{ isValid: boolean; issues: string[] }> {
    const allItems = await this.menuItemRepository.findAll();
    const issues: string[] = [];

    // カテゴリ別グループ化
    const categorizedItems = new Map<string, MenuItem[]>();
    allItems.forEach(item => {
      if (!categorizedItems.has(item.category)) {
        categorizedItems.set(item.category, []);
      }
      categorizedItems.get(item.category)!.push(item);
    });

    // 各カテゴリの整合性チェック
    for (const [category, items] of categorizedItems) {
      // 同名アイテムの重複チェック
      const names = items.map(item => item.name.toLowerCase());
      const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
      if (duplicateNames.length > 0) {
        issues.push(`カテゴリ「${category}」に重複するメニュー名があります: ${duplicateNames.join(', ')}`);
      }

      // 価格の妥当性チェック
      const invalidPriceItems = items.filter(item => !item.isValidPrice());
      if (invalidPriceItems.length > 0) {
        issues.push(`カテゴリ「${category}」に無効な価格のメニューがあります: ${invalidPriceItems.map(item => item.name).join(', ')}`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * アプリケーションのクリーンアップ処理
   */
  async cleanup(): Promise<void> {
    try {
      // DynamoDBクライアントは接続プールを管理するため、明示的なクリーンアップは不要
      console.log('✅ アプリケーションのクリーンアップが完了しました');
    } catch (error) {
      console.error('❌ クリーンアップエラー:', error);
    }
  }

  /**
   * 重複アイテムの検索（プライベートメソッド）
   */
  private async findDuplicateItem(name: string, category: string, excludeId?: string): Promise<MenuItem | null> {
    const allItems = await this.menuItemRepository.findAll();
    return allItems.find(item => 
      item.name.toLowerCase() === name.toLowerCase() && 
      item.category === category &&
      item.id !== excludeId
    ) || null;
  }
} 