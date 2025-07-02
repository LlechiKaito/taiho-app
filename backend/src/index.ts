import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { MenuItemApplicationService } from '@/application/services/MenuItemApplicationService';
import { PrismaMenuItemRepository } from '@/infrastructure/repositories/PrismaMenuItemRepository';
import { MenuItemController } from '@/interfaces/controllers/MenuItemController';
import { createMenuItemRoutes } from '@/interfaces/routes/menuItemRoutes';

// 環境変数の読み込み
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const logLevel = process.env.LOG_LEVEL || 'combined';

// ミドルウェア
app.use(helmet());
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(morgan(logLevel));
app.use(express.json());

// 依存性注入の設定
const menuItemRepository = new PrismaMenuItemRepository();
const menuItemService = new MenuItemApplicationService(menuItemRepository);
const menuItemController = new MenuItemController(menuItemService);

// ルーティング
app.use('/api/menu-items', createMenuItemRoutes(menuItemController));

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: port
  });
});

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

app.listen(port, () => {
  console.log(`サーバーがポート ${port} で起動しました`);
  console.log(`CORS Origin: ${corsOrigin}`);
  console.log(`環境: ${process.env.NODE_ENV}`);
}); 