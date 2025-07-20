import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { DynamoDBOrderRepository } from '@/infrastructure/repositories/DynamoDBOrderRepository';
import { MockMenuItemRepository } from '@/infrastructure/repositories/MockMenuItemRepository';
import { MenuItemApplicationService } from '@/application/services/MenuItemApplicationService';
import { OrderApplicationService } from '@/application/services/OrderApplicationService';
import { MenuItemController } from '@/adapters/controllers/MenuItemController';
import { OrderController } from '@/adapters/controllers/OrderController';
import { createMenuItemRoutes } from '@/adapters/routes/menuItemRoutes';
import { createOrderRoutes } from '@/adapters/routes/orderRoutes';
import { specs } from '@/config/swagger';

const app = express();

// CORS設定
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// 依存性注入
const menuItemRepository = new MockMenuItemRepository(); // 常にMockを使用
const orderRepository = new DynamoDBOrderRepository();

const menuItemApplicationService = new MenuItemApplicationService(menuItemRepository);
const orderApplicationService = new OrderApplicationService(orderRepository);

const menuItemController = new MenuItemController(menuItemApplicationService);
const orderController = new OrderController(orderApplicationService);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: '泰鵬支店 API ドキュメント'
}));

// ルーティング設定
app.use('/', createMenuItemRoutes(menuItemController));
app.use('/', createOrderRoutes(orderController));

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
