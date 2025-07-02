import { MenuItem, CreateMenuItemRequest } from '@/domain/entities/MenuItem';

describe('MenuItem Entity', () => {
  const mockCreateRequest: CreateMenuItemRequest = {
    name: 'テストラーメン',
    description: 'テスト用の説明',
    price: 850,
    category: 'ramen',
    imageUrl: 'test.jpg'
  };

  describe('constructor', () => {
    it('正常なデータでMenuItemを作成できる', () => {
      const menuItem = new MenuItem(
        '1',
        'テストラーメン',
        'テスト用の説明',
        850,
        'ramen',
        'test.jpg',
        true,
        new Date(),
        new Date()
      );

      expect(menuItem.id).toBe('1');
      expect(menuItem.name).toBe('テストラーメン');
      expect(menuItem.price).toBe(850);
      expect(menuItem.isAvailable).toBe(true);
    });

    it('価格が0以下の場合エラーをスローする', () => {
      expect(() => {
        new MenuItem('1', 'テストラーメン', 'テスト用の説明', 0, 'ramen');
      }).toThrow('価格は0より大きい値を設定してください');
    });

    it('価格が10,000円を超える場合エラーをスローする', () => {
      expect(() => {
        new MenuItem('1', 'テストラーメン', 'テスト用の説明', 10001, 'ramen');
      }).toThrow('価格は10,000円以下で設定してください');
    });

    it('名前が空の場合エラーをスローする', () => {
      expect(() => {
        new MenuItem('1', '', 'テスト用の説明', 850, 'ramen');
      }).toThrow('メニュー名は必須です');
    });

    it('名前が100文字を超える場合エラーをスローする', () => {
      const longName = 'a'.repeat(101);
      expect(() => {
        new MenuItem('1', longName, 'テスト用の説明', 850, 'ramen');
      }).toThrow('メニュー名は100文字以下で設定してください');
    });
  });

  describe('price getter/setter', () => {
    let menuItem: MenuItem;

    beforeEach(() => {
      menuItem = MenuItem.create(mockCreateRequest);
    });

    it('価格を正常に設定できる', () => {
      menuItem.price = 900;
      expect(menuItem.price).toBe(900);
    });

    it('不正な価格を設定しようとするとエラーをスローする', () => {
      expect(() => {
        menuItem.price = -100;
      }).toThrow('価格は0より大きい値を設定してください');
    });

    it('価格を変更するとupdatedAtが更新される', () => {
      const originalUpdatedAt = menuItem.updatedAt;
      // 少し待ってから価格を変更
      setTimeout(() => {
        menuItem.price = 900;
        expect(menuItem.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });
  });

  describe('availability methods', () => {
    let menuItem: MenuItem;

    beforeEach(() => {
      menuItem = MenuItem.create(mockCreateRequest);
    });

    it('makeAvailable()で利用可能にできる', () => {
      menuItem.makeUnavailable();
      expect(menuItem.isAvailable).toBe(false);
      
      menuItem.makeAvailable();
      expect(menuItem.isAvailable).toBe(true);
    });

    it('makeUnavailable()で利用不可にできる', () => {
      menuItem.makeUnavailable();
      expect(menuItem.isAvailable).toBe(false);
    });
  });

  describe('business logic methods', () => {
    let menuItem: MenuItem;

    beforeEach(() => {
      menuItem = MenuItem.create(mockCreateRequest);
    });

    it('calculateDiscountedPrice()で割引価格を計算できる', () => {
      const discountedPrice = menuItem.calculateDiscountedPrice(0.1);
      expect(discountedPrice).toBe(765); // 850 * 0.9 = 765
    });

    it('不正な割引率でエラーをスローする', () => {
      expect(() => {
        menuItem.calculateDiscountedPrice(-0.1);
      }).toThrow('割引率は0〜1の範囲で指定してください');

      expect(() => {
        menuItem.calculateDiscountedPrice(1.1);
      }).toThrow('割引率は0〜1の範囲で指定してください');
    });

    it('calculateTaxIncludedPrice()で税込み価格を計算できる', () => {
      const taxIncludedPrice = menuItem.calculateTaxIncludedPrice(0.1);
      expect(taxIncludedPrice).toBe(935); // 850 * 1.1 = 935
    });

    it('getPriceRange()で価格帯を判定できる', () => {
      const lowPriceItem = MenuItem.create({ ...mockCreateRequest, price: 400 });
      const mediumPriceItem = MenuItem.create({ ...mockCreateRequest, price: 700 });
      const highPriceItem = MenuItem.create({ ...mockCreateRequest, price: 1200 });

      expect(lowPriceItem.getPriceRange()).toBe('low');
      expect(mediumPriceItem.getPriceRange()).toBe('medium');
      expect(highPriceItem.getPriceRange()).toBe('high');
    });

    it('getCategoryOrder()でカテゴリの表示順序を取得できる', () => {
      const ramenItem = MenuItem.create({ ...mockCreateRequest, category: 'ramen' });
      const riceItem = MenuItem.create({ ...mockCreateRequest, category: 'rice' });
      const sideItem = MenuItem.create({ ...mockCreateRequest, category: 'side' });
      const unknownItem = MenuItem.create({ ...mockCreateRequest, category: 'unknown' });

      expect(ramenItem.getCategoryOrder()).toBe(1);
      expect(riceItem.getCategoryOrder()).toBe(2);
      expect(sideItem.getCategoryOrder()).toBe(3);
      expect(unknownItem.getCategoryOrder()).toBe(999);
    });

    it('matchesSearch()で検索条件に一致するかを判定できる', () => {
      expect(menuItem.matchesSearch('テスト')).toBe(true);
      expect(menuItem.matchesSearch('ラーメン')).toBe(true);
      expect(menuItem.matchesSearch('ramen')).toBe(true);
      expect(menuItem.matchesSearch('うどん')).toBe(false);
    });
  });

  describe('update method', () => {
    let menuItem: MenuItem;

    beforeEach(() => {
      menuItem = MenuItem.create(mockCreateRequest);
    });

    it('部分的な更新ができる', () => {
      menuItem.update({
        name: '更新されたラーメン',
        price: 900
      });

      expect(menuItem.name).toBe('更新されたラーメン');
      expect(menuItem.price).toBe(900);
      expect(menuItem.description).toBe('テスト用の説明'); // 変更されていない
    });

    it('不正なデータで更新しようとするとエラーをスローする', () => {
      expect(() => {
        menuItem.update({ price: -100 });
      }).toThrow('価格は0より大きい値を設定してください');
    });
  });

  describe('factory method', () => {
    it('create()で新しいMenuItemを作成できる', () => {
      const menuItem = MenuItem.create(mockCreateRequest);

      expect(menuItem.name).toBe('テストラーメン');
      expect(menuItem.price).toBe(850);
      expect(menuItem.isAvailable).toBe(true);
    });
  });

  describe('data conversion methods', () => {
    let menuItem: MenuItem;

    beforeEach(() => {
      menuItem = MenuItem.create(mockCreateRequest);
    });

    it('toPlainObject()でプレーンオブジェクトに変換できる', () => {
      const plainObject = menuItem.toPlainObject();

      expect(plainObject).toHaveProperty('id');
      expect(plainObject).toHaveProperty('name', 'テストラーメン');
      expect(plainObject).toHaveProperty('price', 850);
      expect(plainObject).toHaveProperty('isAvailable', true);
    });

    it('fromPlainObject()でプレーンオブジェクトからMenuItemを作成できる', () => {
      const plainObject = menuItem.toPlainObject();
      const restoredMenuItem = MenuItem.fromPlainObject(plainObject);

      expect(restoredMenuItem.name).toBe(menuItem.name);
      expect(restoredMenuItem.price).toBe(menuItem.price);
      expect(restoredMenuItem.isAvailable).toBe(menuItem.isAvailable);
    });
  });
}); 