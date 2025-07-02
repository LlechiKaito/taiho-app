import { MenuItemApplicationService } from '@/application/services/MenuItemApplicationService';
import { MenuItemRepository } from '@/domain/repositories/MenuItemRepository';
import { MenuItem, CreateMenuItemRequest } from '@/domain/entities/MenuItem';

// モックリポジトリの作成
const mockMenuItemRepository: jest.Mocked<MenuItemRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByCategory: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('MenuItemApplicationService', () => {
  let service: MenuItemApplicationService;
  let mockMenuItems: MenuItem[];

  beforeEach(() => {
    service = new MenuItemApplicationService(mockMenuItemRepository);
    
    // テスト用のMenuItemを作成
    mockMenuItems = [
      new MenuItem('1', 'ラーメン', '醤油ラーメン', 850, 'ramen', undefined, true),
      new MenuItem('2', '餃子', '手作り餃子', 400, 'side', undefined, true),
      new MenuItem('3', 'チャーシュー丼', 'チャーシュー丼', 650, 'rice', undefined, false),
      new MenuItem('4', '味噌ラーメン', '味噌ラーメン', 900, 'ramen', undefined, true),
    ];

    // モックをリセット
    jest.clearAllMocks();
  });

  describe('getAllMenuItems', () => {
    it('全てのメニューアイテムを取得できる', async () => {
      mockMenuItemRepository.findAll.mockResolvedValue(mockMenuItems);

      const result = await service.getAllMenuItems();

      expect(mockMenuItemRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMenuItems);
    });
  });

  describe('getMenuItemById', () => {
    it('IDでメニューアイテムを取得できる', async () => {
      const targetItem = mockMenuItems[0];
      mockMenuItemRepository.findById.mockResolvedValue(targetItem);

      const result = await service.getMenuItemById('1');

      expect(mockMenuItemRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(targetItem);
    });

    it('存在しないIDの場合nullを返す', async () => {
      mockMenuItemRepository.findById.mockResolvedValue(null);

      const result = await service.getMenuItemById('999');

      expect(result).toBeNull();
    });
  });

  describe('getMenuItemsByCategory', () => {
    it('カテゴリでメニューアイテムを取得できる', async () => {
      const ramenItems = mockMenuItems.filter(item => item.category === 'ramen');
      mockMenuItemRepository.findByCategory.mockResolvedValue(ramenItems);

      const result = await service.getMenuItemsByCategory('ramen');

      expect(mockMenuItemRepository.findByCategory).toHaveBeenCalledWith('ramen');
      expect(result).toEqual(ramenItems);
    });
  });

  describe('createMenuItem', () => {
    it('メニューアイテムを作成できる', async () => {
      const createRequest: CreateMenuItemRequest = {
        name: '新しいラーメン',
        description: '新しい説明',
        price: 950,
        category: 'ramen'
      };
      const createdItem = new MenuItem('5', createRequest.name, createRequest.description, createRequest.price, createRequest.category);
      mockMenuItemRepository.create.mockResolvedValue(createdItem);

      const result = await service.createMenuItem(createRequest);

      expect(mockMenuItemRepository.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(createdItem);
    });
  });

  describe('getAvailableMenuItems', () => {
    it('利用可能なメニューアイテムのみを取得できる', async () => {
      mockMenuItemRepository.findAll.mockResolvedValue(mockMenuItems);

      const result = await service.getAvailableMenuItems();

      const expectedItems = mockMenuItems.filter(item => item.isAvailable);
      expect(result).toEqual(expectedItems);
      expect(result).toHaveLength(3); // 1つは利用不可
    });
  });

  describe('searchMenuItems', () => {
    it('検索条件に一致するメニューアイテムを取得できる', async () => {
      mockMenuItemRepository.findAll.mockResolvedValue(mockMenuItems);

      const result = await service.searchMenuItems('ラーメン');

      const expectedItems = mockMenuItems.filter(item => item.matchesSearch('ラーメン'));
      expect(result).toEqual(expectedItems);
    });
  });

  describe('getMenuItemsWithDiscount', () => {
    it('割引価格付きのメニューアイテムを取得できる', async () => {
      const availableItems = mockMenuItems.filter(item => item.isAvailable);
      mockMenuItemRepository.findAll.mockResolvedValue(mockMenuItems);

      const result = await service.getMenuItemsWithDiscount(0.1);

      expect(result).toHaveLength(3); // 利用可能なアイテムのみ
      expect(result[0]).toHaveProperty('item');
      expect(result[0]).toHaveProperty('discountedPrice');
      expect(result[0].discountedPrice).toBe(765); // 850 * 0.9
    });
  });

  describe('getMenuItemsByPriceRange', () => {
    it('価格帯でメニューアイテムをフィルタリングできる', async () => {
      mockMenuItemRepository.findAll.mockResolvedValue(mockMenuItems);

      const lowPriceResult = await service.getMenuItemsByPriceRange('low');
      const mediumPriceResult = await service.getMenuItemsByPriceRange('medium');
      const highPriceResult = await service.getMenuItemsByPriceRange('high');

      expect(lowPriceResult).toHaveLength(1); // 餃子 (400円)
      expect(mediumPriceResult).toHaveLength(2); // ラーメン (850円), チャーシュー丼 (650円)
      expect(highPriceResult).toHaveLength(1); // 味噌ラーメン (900円)
    });
  });

  describe('getSortedMenuItemsByCategory', () => {
    it('カテゴリ順でソートされたメニューアイテムを取得できる', async () => {
      mockMenuItemRepository.findAll.mockResolvedValue(mockMenuItems);

      const result = await service.getSortedMenuItemsByCategory();

      // ramen -> rice -> side の順番になることを確認
      expect(result[0].category).toBe('ramen');
      expect(result[1].category).toBe('ramen');
      expect(result[2].category).toBe('rice');
      expect(result[3].category).toBe('side');
    });
  });

  describe('makeMenuItemAvailable', () => {
    it('メニューアイテムを利用可能にできる', async () => {
      const targetItem = mockMenuItems[2]; // 利用不可のアイテム
      mockMenuItemRepository.findById.mockResolvedValue(targetItem);
      mockMenuItemRepository.update.mockResolvedValue(targetItem);

      const result = await service.makeMenuItemAvailable('3');

      expect(mockMenuItemRepository.findById).toHaveBeenCalledWith('3');
      expect(mockMenuItemRepository.update).toHaveBeenCalledWith('3', { isAvailable: true });
      expect(result).toEqual(targetItem);
    });

    it('存在しないアイテムの場合nullを返す', async () => {
      mockMenuItemRepository.findById.mockResolvedValue(null);

      const result = await service.makeMenuItemAvailable('999');

      expect(result).toBeNull();
    });
  });

  describe('getMenuWithTaxIncluded', () => {
    it('税込み価格付きのメニューを取得できる', async () => {
      mockMenuItemRepository.findAll.mockResolvedValue(mockMenuItems);

      const result = await service.getMenuWithTaxIncluded(0.1);

      expect(result).toHaveLength(4);
      expect(result[0]).toHaveProperty('item');
      expect(result[0]).toHaveProperty('taxIncludedPrice');
      expect(result[0].taxIncludedPrice).toBe(935); // 850 * 1.1
    });
  });

  describe('validateAndUpdatePrice', () => {
    it('価格を正常に更新できる', async () => {
      const targetItem = mockMenuItems[0];
      mockMenuItemRepository.findById.mockResolvedValue(targetItem);
      mockMenuItemRepository.update.mockResolvedValue(targetItem);

      const result = await service.validateAndUpdatePrice('1', 1000);

      expect(mockMenuItemRepository.findById).toHaveBeenCalledWith('1');
      expect(mockMenuItemRepository.update).toHaveBeenCalledWith('1', { price: 1000 });
      expect(result).toEqual(targetItem);
    });

    it('不正な価格の場合エラーをスローする', async () => {
      const targetItem = mockMenuItems[0];
      mockMenuItemRepository.findById.mockResolvedValue(targetItem);

      await expect(
        service.validateAndUpdatePrice('1', -100)
      ).rejects.toThrow('価格更新エラー: 価格は0より大きい値を設定してください');
    });

    it('存在しないアイテムの場合nullを返す', async () => {
      mockMenuItemRepository.findById.mockResolvedValue(null);

      const result = await service.validateAndUpdatePrice('999', 1000);

      expect(result).toBeNull();
    });
  });
}); 