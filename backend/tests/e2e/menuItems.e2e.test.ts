import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { MenuItemApplicationService } from '@/application/services/MenuItemApplicationService';
import { PrismaMenuItemRepository } from '@/infrastructure/repositories/PrismaMenuItemRepository';
import { MenuItemController } from '@/interfaces/controllers/MenuItemController';
import { createMenuItemRoutes } from '@/interfaces/routes/menuItemRoutes';

describe('MenuItems E2E Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    // テスト用のExpressアプリを作成
    app = express();
    app.use(cors());
    app.use(express.json());

    // 依存性注入
    const menuItemRepository = new PrismaMenuItemRepository();
    const menuItemService = new MenuItemApplicationService(menuItemRepository);
    const menuItemController = new MenuItemController(menuItemService);

    // ルーティング
    app.use('/api/menu-items', createMenuItemRoutes(menuItemController));
  });

  beforeEach(async () => {
    // 各テスト前にデータベースをクリーンアップ
    await global.testPrisma.menuItem.deleteMany({});
  });

  describe('GET /api/menu-items', () => {
    it('空の配列を返す（データが無い場合）', async () => {
      const response = await request(app)
        .get('/api/menu-items')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('メニューアイテムの一覧を取得できる', async () => {
      // テストデータを作成
      await global.testPrisma.menuItem.createMany({
        data: [
          {
            name: 'テストラーメン',
            description: 'テスト用ラーメン',
            price: 850,
            category: 'ramen',
            isAvailable: true
          },
          {
            name: 'テスト餃子',
            description: 'テスト用餃子',
            price: 400,
            category: 'side',
            isAvailable: true
          }
        ]
      });

      const response = await request(app)
        .get('/api/menu-items')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'テストラーメン');
      expect(response.body[1]).toHaveProperty('name', 'テスト餃子');
    });
  });

  describe('GET /api/menu-items/:id', () => {
    it('存在するメニューアイテムを取得できる', async () => {
      // テストデータを作成
      const createdItem = await global.testPrisma.menuItem.create({
        data: {
          name: 'テストラーメン',
          description: 'テスト用ラーメン',
          price: 850,
          category: 'ramen',
          isAvailable: true
        }
      });

      const response = await request(app)
        .get(`/api/menu-items/${createdItem.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdItem.id);
      expect(response.body).toHaveProperty('name', 'テストラーメン');
    });

    it('存在しないメニューアイテムの場合404を返す', async () => {
      const response = await request(app)
        .get('/api/menu-items/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'メニューアイテムが見つかりません');
    });
  });

  describe('GET /api/menu-items/category/:category', () => {
    it('カテゴリ別のメニューアイテムを取得できる', async () => {
      // テストデータを作成
      await global.testPrisma.menuItem.createMany({
        data: [
          {
            name: 'ラーメン1',
            description: 'ラーメン1',
            price: 850,
            category: 'ramen',
            isAvailable: true
          },
          {
            name: 'ラーメン2',
            description: 'ラーメン2',
            price: 900,
            category: 'ramen',
            isAvailable: true
          },
          {
            name: '餃子',
            description: '餃子',
            price: 400,
            category: 'side',
            isAvailable: true
          }
        ]
      });

      const response = await request(app)
        .get('/api/menu-items/category/ramen')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach((item: any) => {
        expect(item.category).toBe('ramen');
      });
    });
  });

  describe('POST /api/menu-items', () => {
    it('新しいメニューアイテムを作成できる', async () => {
      const newItem = {
        name: '新しいラーメン',
        description: '新しい説明',
        price: 950,
        category: 'ramen',
        imageUrl: 'test.jpg'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', '新しいラーメン');
      expect(response.body).toHaveProperty('price', 950);
      expect(response.body).toHaveProperty('isAvailable', true);

      // データベースに実際に保存されているか確認
      const savedItem = await global.testPrisma.menuItem.findUnique({
        where: { id: response.body.id }
      });
      expect(savedItem).toBeTruthy();
      expect(savedItem?.name).toBe('新しいラーメン');
    });

    it('不正なデータの場合エラーを返す', async () => {
      const invalidItem = {
        name: '', // 空の名前
        description: 'テスト',
        price: -100, // 不正な価格
        category: 'ramen'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidItem)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/menu-items/:id', () => {
    it('既存のメニューアイテムを更新できる', async () => {
      // テストデータを作成
      const createdItem = await global.testPrisma.menuItem.create({
        data: {
          name: 'テストラーメン',
          description: 'テスト用ラーメン',
          price: 850,
          category: 'ramen',
          isAvailable: true
        }
      });

      const updateData = {
        name: '更新されたラーメン',
        price: 900
      };

      const response = await request(app)
        .put(`/api/menu-items/${createdItem.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', '更新されたラーメン');
      expect(response.body).toHaveProperty('price', 900);
      expect(response.body).toHaveProperty('description', 'テスト用ラーメン'); // 変更されていない

      // データベースが実際に更新されているか確認
      const updatedItem = await global.testPrisma.menuItem.findUnique({
        where: { id: createdItem.id }
      });
      expect(updatedItem?.name).toBe('更新されたラーメン');
      expect(updatedItem?.price.toString()).toBe('900');
    });

    it('存在しないメニューアイテムの場合404を返す', async () => {
      const updateData = {
        name: '更新されたラーメン'
      };

      const response = await request(app)
        .put('/api/menu-items/00000000-0000-0000-0000-000000000000')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'メニューアイテムが見つかりません');
    });
  });

  describe('DELETE /api/menu-items/:id', () => {
    it('既存のメニューアイテムを削除できる', async () => {
      // テストデータを作成
      const createdItem = await global.testPrisma.menuItem.create({
        data: {
          name: 'テストラーメン',
          description: 'テスト用ラーメン',
          price: 850,
          category: 'ramen',
          isAvailable: true
        }
      });

      await request(app)
        .delete(`/api/menu-items/${createdItem.id}`)
        .expect(204);

      // データベースから削除されているか確認
      const deletedItem = await global.testPrisma.menuItem.findUnique({
        where: { id: createdItem.id }
      });
      expect(deletedItem).toBeNull();
    });

    it('存在しないメニューアイテムの場合404を返す', async () => {
      const response = await request(app)
        .delete('/api/menu-items/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'メニューアイテムが見つかりません');
    });
  });
}); 