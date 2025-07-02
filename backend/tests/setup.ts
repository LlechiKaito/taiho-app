import { PrismaClient } from '@prisma/client';

// テスト用のPrismaクライアント
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://taiho_user:taiho_password@localhost:5432/taiho_ramen_test?schema=public'
    }
  }
});

// テスト前のセットアップ
beforeAll(async () => {
  // テストデータベースのクリーンアップ
  await prisma.menuItem.deleteMany({});
});

// テスト後のクリーンアップ
afterEach(async () => {
  // 各テスト後にデータをクリーンアップ
  await prisma.menuItem.deleteMany({});
});

// 全テスト完了後の処理
afterAll(async () => {
  await prisma.$disconnect();
});

// グローバルにprismaを利用可能にする
(global as any).testPrisma = prisma; 