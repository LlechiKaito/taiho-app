import express from 'express';
import cors from 'cors';
import { DynamoDBMenuItemRepository } from './infrastructure/repositories/DynamoDBMenuItemRepository';
import { MenuItemApplicationService } from './application/services/MenuItemApplicationService';
import { MenuItemController } from './adapters/controllers/MenuItemController';
import { createMenuItemRoutes } from './adapters/routes/menuItemRoutes';

const app = express();

// CORS設定
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// 依存性注入
const menuItemRepository = new DynamoDBMenuItemRepository();
const menuItemApplicationService = new MenuItemApplicationService(menuItemRepository);
const menuItemController = new MenuItemController(menuItemApplicationService);

// ルーティング設定
app.use('/', createMenuItemRoutes(menuItemController));

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
