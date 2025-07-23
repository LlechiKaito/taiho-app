import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { DynamoDBOrderRepository } from '@/infrastructure/repositories/orders/DynamoDBOrderRepository';
import { DynamoDBOrderListRepository } from '@/infrastructure/repositories/orderLists/DynamoDBOrderListRepository';
import { MockMenuItemRepository } from '@/infrastructure/repositories/menuItems/MockMenuItemRepository';
import { MenuItemApplicationService } from '@/application/services/menuItems/MenuItemApplicationService';
import { OrderApplicationService } from '@/application/services/orders/OrderApplicationService';
import { MenuItemController } from '@/adapters/controllers/menuItems/MenuItemController';
import { OrderController } from '@/adapters/controllers/orders/OrderController';
import { createMenuItemRoutes } from '@/adapters/routes/menuItems/menuItemRoutes';
import { createOrderRoutes } from '@/adapters/routes/orders/orderRoutes';
import userRoutes from '@/adapters/routes/users/userRoutes';
import orderListRoutes from '@/adapters/routes/orderLists/orderListRoutes';
import chatRoutes from '@/adapters/routes/chats/chatRoutes';
import eventRoutes from '@/adapters/routes/events/eventRoutes';
import calendarRoutes from '@/adapters/routes/calendars/calendarRoutes';
import couponRoutes from '@/adapters/routes/coupons/couponRoutes';
import authRoutes from '@/adapters/routes/users/authRoutes';
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
const orderListRepository = new DynamoDBOrderListRepository();

const menuItemApplicationService = new MenuItemApplicationService(menuItemRepository);
const orderApplicationService = new OrderApplicationService(orderRepository, orderListRepository);

const menuItemController = new MenuItemController(menuItemApplicationService);
const orderController = new OrderController(orderApplicationService);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: '泰鵬支店 API ドキュメント',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true
  }
}));

// ルーティング設定
app.use('/', createMenuItemRoutes(menuItemController));
app.use('/', createOrderRoutes(orderController));
app.use('/', userRoutes);
app.use('/', orderListRoutes);
app.use('/', chatRoutes);
app.use('/', eventRoutes);
app.use('/', calendarRoutes);
app.use('/', couponRoutes);
app.use('/', authRoutes);

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
