export class MenuItem {
  private static readonly VALID_CATEGORIES = ['ラーメン', 'ご飯もの', 'サイドメニュー', 'ドリンク'] as const;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly category: string,
    public readonly imageUrl: string | null,
    public readonly isAvailable: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // ビジネスロジック
  public isValidPrice(): boolean {
    return this.price > 0;
  }

  public isValidCategory(): boolean {
    return MenuItem.VALID_CATEGORIES.includes(this.category as any);
  }

  public canBeOrdered(): boolean {
    return this.isAvailable && this.isValidPrice();
  }

  public toggleAvailability(): MenuItem {
    return new MenuItem(
      this.id,
      this.name,
      this.description,
      this.price,
      this.category,
      this.imageUrl,
      !this.isAvailable,
      this.createdAt,
      this.updatedAt
    );
  }

  // 静的バリデーションメソッド
  public static validateCreateData(data: CreateMenuItemData): void {
    // 必須項目チェック
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('メニュー名は必須です');
    }

    if (!data.price || data.price <= 0) {
      throw new Error('価格は0より大きい値を設定してください');
    }

    if (!data.category || data.category.trim().length === 0) {
      throw new Error('カテゴリは必須です');
    }

    // カテゴリの妥当性チェック
    if (!MenuItem.VALID_CATEGORIES.includes(data.category as any)) {
      throw new Error(`カテゴリは ${MenuItem.VALID_CATEGORIES.join(', ')} のいずれかを選択してください`);
    }
  }

  public static validateDuplicateName(name: string, category: string, existingItems: MenuItem[]): void {
    const duplicateItem = existingItems.find(item => 
      item.name.toLowerCase() === name.toLowerCase() && 
      item.category === category
    );
    
    if (duplicateItem) {
      throw new Error('同じカテゴリに同名のメニューが既に存在します');
    }
  }

  public static getValidCategories(): readonly string[] {
    return MenuItem.VALID_CATEGORIES;
  }

  public static filterAvailableItems(items: MenuItem[]): MenuItem[] {
    return items.filter(item => item.canBeOrdered());
  }

  public static filterByPriceRange(items: MenuItem[], minPrice: number, maxPrice: number): MenuItem[] {
    return items.filter(item => 
      item.price >= minPrice && item.price <= maxPrice && item.isAvailable
    );
  }

  public static getCategorySummary(items: MenuItem[]): { category: string; count: number; avgPrice: number }[] {
    const categoryMap = new Map<string, MenuItem[]>();

    // カテゴリ別にグループ化
    items.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      categoryMap.get(item.category)!.push(item);
    });

    // 各カテゴリの統計を計算
    return Array.from(categoryMap.entries()).map(([category, categoryItems]) => ({
      category,
      count: categoryItems.length,
      avgPrice: categoryItems.reduce((sum, item) => sum + item.price, 0) / categoryItems.length
    }));
  }
}

export interface CreateMenuItemData {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateMenuItemData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
} 