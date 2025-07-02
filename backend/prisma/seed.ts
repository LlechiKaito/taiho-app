import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('シードデータの挿入を開始します...');

  const menuItems = [
    {
      name: '泰鵬醤油ラーメン',
      description: '昔ながらの醤油スープにコシのある麺',
      price: 850.00,
      category: 'ramen',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: '泰鵬味噌ラーメン',
      description: '濃厚な味噌スープが自慢の一品',
      price: 900.00,
      category: 'ramen',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: '泰鵬塩ラーメン',
      description: 'あっさりとした塩スープで素材の味を活かしたラーメン',
      price: 800.00,
      category: 'ramen',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: '泰鵬つけ麺',
      description: '濃厚なつけ汁で食べる太麺',
      price: 950.00,
      category: 'ramen',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: 'チャーシュー丼',
      description: '柔らかいチャーシューと甘辛いタレが絶品',
      price: 650.00,
      category: 'rice',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: 'チャーシュー麺',
      description: 'チャーシューたっぷりの醤油ラーメン',
      price: 950.00,
      category: 'ramen',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: '餃子（6個）',
      description: '皮が薄く、中身がジューシーな手作り餃子',
      price: 400.00,
      category: 'side',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: '餃子（12個）',
      description: '皮が薄く、中身がジューシーな手作り餃子',
      price: 700.00,
      category: 'side',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: 'ライス',
      description: '白米',
      price: 200.00,
      category: 'side',
      imageUrl: null,
      isAvailable: true,
    },
    {
      name: '替え玉',
      description: '麺の追加',
      price: 150.00,
      category: 'side',
      imageUrl: null,
      isAvailable: true,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  console.log('シードデータの挿入が完了しました');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 