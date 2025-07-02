export class MenuItem {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    private _price: number,
    public category: string,
    public imageUrl?: string,
    private _isAvailable: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this.validatePrice(_price);
    this.validateName(name);
  }

  // ビジネスロジック: 価格の取得とバリデーション
  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this.validatePrice(value);
    this._price = value;
    this.updatedAt = new Date();
  }

  // ビジネスロジック: 利用可否の管理
  get isAvailable(): boolean {
    return this._isAvailable;
  }

  makeAvailable(): void {
    this._isAvailable = true;
    this.updatedAt = new Date();
  }

  makeUnavailable(): void {
    this._isAvailable = false;
    this.updatedAt = new Date();
  }

  // ビジネスロジック: 割引価格の計算
  calculateDiscountedPrice(discountRate: number): number {
    if (discountRate < 0 || discountRate > 1) {
      throw new Error('割引率は0〜1の範囲で指定してください');
    }
    return Math.round(this._price * (1 - discountRate));
  }

  // ビジネスロジック: カテゴリ別の表示順序
  getCategoryOrder(): number {
    const categoryOrder: { [key: string]: number } = {
      'ramen': 1,
      'rice': 2,
      'side': 3
    };
    return categoryOrder[this.category] || 999;
  }

  // ビジネスロジック: 税込み価格の計算
  calculateTaxIncludedPrice(taxRate: number = 0.1): number {
    return Math.round(this._price * (1 + taxRate));
  }

  // ビジネスロジック: メニューアイテムの更新
  update(data: UpdateMenuItemRequest): void {
    if (data.name !== undefined) {
      this.validateName(data.name);
      this.name = data.name;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.price !== undefined) {
      this.price = data.price; // setterを使用
    }
    if (data.category !== undefined) {
      this.category = data.category;
    }
    if (data.imageUrl !== undefined) {
      this.imageUrl = data.imageUrl;
    }
    if (data.isAvailable !== undefined) {
      this._isAvailable = data.isAvailable;
    }
    this.updatedAt = new Date();
  }

  // ビジネスロジック: メニューアイテムの検索適合性チェック
  matchesSearch(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return this.name.toLowerCase().includes(term) ||
           this.description.toLowerCase().includes(term) ||
           this.category.toLowerCase().includes(term);
  }

  // ビジネスロジック: 価格帯の判定
  getPriceRange(): 'low' | 'medium' | 'high' {
    if (this._price < 500) return 'low';
    if (this._price < 1000) return 'medium';
    return 'high';
  }

  // プライベートメソッド: バリデーション
  private validatePrice(price: number): void {
    if (price <= 0) {
      throw new Error('価格は0より大きい値を設定してください');
    }
    if (price > 10000) {
      throw new Error('価格は10,000円以下で設定してください');
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('メニュー名は必須です');
    }
    if (name.length > 100) {
      throw new Error('メニュー名は100文字以下で設定してください');
    }
  }

  // ファクトリーメソッド
  static create(data: CreateMenuItemRequest): MenuItem {
    return new MenuItem(
      '', // IDは後でリポジトリが設定
      data.name,
      data.description,
      data.price,
      data.category,
      data.imageUrl
    );
  }

  // データ変換メソッド
  toPlainObject(): MenuItemData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this._price,
      category: this.category,
      imageUrl: this.imageUrl,
      isAvailable: this._isAvailable,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromPlainObject(data: MenuItemData): MenuItem {
    return new MenuItem(
      data.id,
      data.name,
      data.description,
      data.price,
      data.category,
      data.imageUrl,
      data.isAvailable,
      data.createdAt,
      data.updatedAt
    );
  }
}

// データ転送用のインターフェース
export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
} 