import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '泰鵬支店 API',
      version: '1.0.0',
      description: '泰鵬支店のメニューと注文管理API',
      contact: {
        name: 'API Support',
        email: 'support@taiho.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: '開発サーバー'
      }
    ],
    components: {
      schemas: {
        MenuItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '醤油ラーメン' },
            photoUrl: { type: 'string', example: 'https://example.com/ramen.jpg' },
            description: { type: 'string', example: '醤油ベースの定番ラーメン' },
            price: { type: 'integer', example: 800 },
            category: { type: 'string', example: 'ラーメン' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            isCooked: { type: 'boolean', example: false },
            isPayment: { type: 'boolean', example: false },
            isTakeOut: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2025-07-20T01:15:46.281Z' },
            description: { type: 'string', example: '醤油ラーメン x1, 唐揚げ x1' },
            isComplete: { type: 'boolean', example: false }
          }
        },
        MenuItemList: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/MenuItem' }
            },
            total: { type: 'integer', example: 6 }
          }
        },
        OrderList: {
          type: 'object',
          properties: {
            orders: {
              type: 'array',
              items: { $ref: '#/components/schemas/Order' }
            },
            total: { type: 'integer', example: 4 }
          }
        }
      }
    }
  },
  apis: ['./src/config/swagger.ts']
};

export const specs = swaggerJsdoc(options);

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: 全メニューアイテム取得
 *     description: 利用可能なすべてのメニューアイテムを取得します
 *     tags: [Menu Items]
 *     responses:
 *       200:
 *         description: メニューアイテムの取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItemList'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 * 
 * /api/orders:
 *   get:
 *     summary: 全注文取得
 *     description: すべての注文情報を取得します
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, cooking, completed]
 *         description: 注文のステータスでフィルタリング
 *         example: all
 *     responses:
 *       200:
 *         description: 注文の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderList'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */ 