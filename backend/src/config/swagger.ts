import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        OrderDetail: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            isCooked: { type: 'boolean', example: false },
            isPayment: { type: 'boolean', example: false },
            isTakeOut: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2025-07-20T01:15:46.281Z' },
            description: { type: 'string', example: '醤油ラーメン x1, 唐揚げ x1' },
            isComplete: { type: 'boolean', example: false },
            orderLists: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  orderId: { type: 'integer', example: 1 },
                  itemId: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '田中太郎' },
            email: { type: 'string', example: 'tanaka@example.com' },
            address: { type: 'string', example: '東京都渋谷区1-1-1' },
            telephoneNumber: { type: 'string', example: '03-1234-5678' },
            gender: { type: 'string', example: '男性' },
            isAdmin: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2025-07-20T01:15:46.281Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-07-20T01:15:46.281Z' }
          }
        },
        OrderList: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            orderId: { type: 'integer', example: 1 },
            itemId: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 1 }
          }
        },
        Chat: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            orderId: { type: 'integer', example: 1 },
            content: { type: 'string', example: '注文の確認をお願いします' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            photoUrl: { type: 'string', example: 'https://example.com/event1.jpg' },
            priority: { type: 'integer', example: 1 }
          }
        },
        CreateEventRequest: {
          type: 'object',
          properties: {
            photoUrl: { type: 'string', example: 'https://example.com/event1.jpg' },
            priority: { type: 'integer', example: 1 }
          },
          required: ['photoUrl', 'priority']
        },
        UpdateEventRequest: {
          type: 'object',
          properties: {
            photoUrl: { type: 'string', example: 'https://example.com/updated-event.jpg' },
            priority: { type: 'integer', example: 2 }
          }
        },
        Coupon: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'SAVE20' },
            discountAmount: { type: 'integer', example: 20 },
            discountType: { type: 'string', enum: ['percentage', 'fixed'], example: 'percentage' },
            isUsed: { type: 'boolean', example: false },
            expiresAt: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59.000Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        CreateCouponRequest: {
          type: 'object',
          properties: {
            userId: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'SAVE20' },
            discountAmount: { type: 'integer', example: 20 },
            discountType: { type: 'string', enum: ['percentage', 'fixed'], example: 'percentage' },
            expiresAt: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59.000Z' }
          },
          required: ['userId', 'code', 'discountAmount', 'discountType', 'expiresAt']
        },
        UpdateCouponRequest: {
          type: 'object',
          properties: {
            userId: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'SAVE30' },
            discountAmount: { type: 'integer', example: 30 },
            discountType: { type: 'string', enum: ['percentage', 'fixed'], example: 'percentage' },
            isUsed: { type: 'boolean', example: true },
            expiresAt: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59.000Z' }
          }
        },
        UseCouponResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'SAVE20' },
            discountAmount: { type: 'integer', example: 20 },
            discountType: { type: 'string', enum: ['percentage', 'fixed'], example: 'percentage' },
            isUsed: { type: 'boolean', example: true },
            expiresAt: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59.000Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            message: { type: 'string', example: 'クーポンを使用しました' }
          }
        },
        Calendar: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            photoUrl: { type: 'string', example: 'https://example.com/calendar1.jpg' },
            yearMonth: { type: 'string', example: '2024-06' }
          }
        },
        CreateCalendarRequest: {
          type: 'object',
          properties: {
            photoUrl: { type: 'string', example: 'https://example.com/calendar1.jpg' },
            timestamp: { type: 'integer', example: 1640995200000 }
          },
          required: ['photoUrl', 'timestamp']
        },
        UpdateCalendarRequest: {
          type: 'object',
          properties: {
            photoUrl: { type: 'string', example: 'https://example.com/updated-calendar.jpg' },
            timestamp: { type: 'integer', example: 1640995200000 }
          }
        },
        CreateOrderRequest: {
          type: 'object',
          properties: {
            userId: { type: 'integer', example: 1 },
            isTakeOut: { type: 'boolean', example: true },
            itemList: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  itemId: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', example: 2 }
                },
                required: ['itemId', 'quantity']
              }
            }
          },
          required: ['userId', 'isTakeOut', 'itemList']
        },
        CreateOrderResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            userId: { type: 'integer', example: 1 },
            isCooked: { type: 'boolean', example: false },
            isPayment: { type: 'boolean', example: false },
            isTakeOut: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2025-07-20T01:15:46.281Z' },
            description: { type: 'string', example: '商品1 x2, 商品2 x1' },
            isComplete: { type: 'boolean', example: false },
            orderLists: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 5 },
                  orderId: { type: 'integer', example: 5 },
                  itemId: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'tanaka@example.com' },
            password: { type: 'string', example: 'password123' }
          },
          required: ['email', 'password']
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: '田中太郎' },
            email: { type: 'string', example: 'tanaka@example.com' },
            password: { type: 'string', example: 'password123' },
            address: { type: 'string', example: '東京都渋谷区1-1-1' },
            telephoneNumber: { type: 'string', example: '03-1234-5678' },
            gender: { type: 'string', example: '男性' }
          },
          required: ['name', 'email', 'password', 'address', 'telephoneNumber', 'gender']
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'ユーザー登録が完了しました' },
            user: { $ref: '#/components/schemas/User' }
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
        OrderListResponse: {
          type: 'object',
          properties: {
            orders: {
              type: 'array',
              items: { $ref: '#/components/schemas/Order' }
            },
            total: { type: 'integer', example: 4 }
          }
        },
        UserList: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' }
            },
            total: { type: 'integer', example: 3 }
          }
        },
        OrderListList: {
          type: 'object',
          properties: {
            orderLists: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderList' }
            },
            total: { type: 'integer', example: 4 }
          }
        },
        ChatList: {
          type: 'object',
          properties: {
            chats: {
              type: 'array',
              items: { $ref: '#/components/schemas/Chat' }
            },
            total: { type: 'integer', example: 3 }
          }
        },
        EventList: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: { $ref: '#/components/schemas/Event' }
            },
            total: { type: 'integer', example: 3 }
          }
        },
        CalendarList: {
          type: 'object',
          properties: {
            calendars: {
              type: 'array',
              items: { $ref: '#/components/schemas/Calendar' }
            },
            total: { type: 'integer', example: 3 }
          }
        },
        CouponList: {
          type: 'object',
          properties: {
            coupons: {
              type: 'array',
              items: { $ref: '#/components/schemas/Coupon' }
            },
            total: { type: 'integer', example: 3 }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
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
 *       404:
 *         description: メニューアイテムが見つかりません
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
 *               $ref: '#/components/schemas/OrderListResponse'
 *       404:
 *         description: 注文が見つかりません
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
 *   post:
 *     summary: 注文作成
 *     description: 新しい注文を作成します（注文明細も同時に作成）
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: 注文作成成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrderResponse'
 *       400:
 *         description: バリデーションエラー
 * 
 * /api/orders/{id}:
 *   get:
 *     summary: 注文詳細取得
 *     description: 指定されたIDの注文情報と注文明細を取得します
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 注文ID
 *     responses:
 *       200:
 *         description: 注文の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: 注文が見つかりません
 *       400:
 *         description: 無効なID形式
 * 
 * /api/auth/login:
 *   post:
 *     summary: ユーザーログイン
 *     description: メールアドレスとパスワードでログインします
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: ログイン成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証失敗
 * 
 * /api/auth/register:
 *   post:
 *     summary: ユーザー登録
 *     description: 新しいユーザーを登録します
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: ユーザー登録成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: バリデーションエラー
 * 
 * /api/auth/verify:
 *   post:
 *     summary: トークン検証
 *     description: JWTトークンの有効性を検証します
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: トークン有効
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     isAdmin:
 *                       type: boolean
 *       401:
 *         description: 無効なトークン
 * 
 * /api/users:
 *   get:
 *     summary: ユーザー一覧取得
 *     description: すべてのユーザー情報を取得します
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: ユーザー一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserList'
 *       404:
 *         description: ユーザーが見つかりません
 * 
 * /api/users/{id}:
 *   get:
 *     summary: ユーザー詳細取得
 *     description: 指定されたIDのユーザー情報を取得します
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ユーザーID
 *     responses:
 *       200:
 *         description: ユーザー詳細の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: ユーザーが見つかりません
 * 
 * /api/order-lists:
 *   get:
 *     summary: 注文明細一覧取得
 *     description: すべての注文明細情報を取得します
 *     tags: [Order Lists]
 *     responses:
 *       200:
 *         description: 注文明細一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListList'
 *       404:
 *         description: 注文明細が見つかりません
 * 
 * /api/chats:
 *   get:
 *     summary: チャット一覧取得
 *     description: すべてのチャット情報を取得します
 *     tags: [Chats]
 *     responses:
 *       200:
 *         description: チャット一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatList'
 *       404:
 *         description: チャットが見つかりません
 * 
 * /api/events:
 *   get:
 *     summary: イベント一覧取得
 *     description: すべてのイベント情報を取得します
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: イベント一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventList'
 *       404:
 *         description: イベントが見つかりません
 *   post:
 *     summary: イベント作成
 *     description: 新しいイベントを作成します（管理者のみ）
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventRequest'
 *     responses:
 *       201:
 *         description: イベント作成成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 * 
 * /api/events/{id}:
 *   get:
 *     summary: イベント詳細取得
 *     description: 指定されたIDのイベント情報を取得します
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: イベントID
 *     responses:
 *       200:
 *         description: イベント詳細の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: イベントが見つかりません
 *   put:
 *     summary: イベント更新
 *     description: 指定されたIDのイベント情報を更新します（管理者のみ）
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: イベントID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventRequest'
 *     responses:
 *       200:
 *         description: イベント更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 *       404:
 *         description: イベントが見つかりません
 *   delete:
 *     summary: イベント削除
 *     description: 指定されたIDのイベントを削除します（管理者のみ）
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: イベントID
 *     responses:
 *       200:
 *         description: イベント削除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "イベントを削除しました"
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 *       404:
 *         description: イベントが見つかりません
 * 
 * /api/calendars:
 *   get:
 *     summary: カレンダー一覧取得
 *     description: 今月分のカレンダー情報を取得します
 *     tags: [Calendars]
 *     responses:
 *       200:
 *         description: カレンダー一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarList'
 *       404:
 *         description: カレンダーが見つかりません
 *   post:
 *     summary: カレンダー作成
 *     description: 新しいカレンダーを作成します（管理者のみ）。同じ月に既にカレンダーが存在する場合は作成できません
 *     tags: [Calendars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCalendarRequest'
 *     responses:
 *       201:
 *         description: カレンダー作成成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 * 
 * /api/calendars/{id}:
 *   get:
 *     summary: カレンダー詳細取得
 *     description: 指定されたIDのカレンダー情報を取得します
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: カレンダーID
 *     responses:
 *       200:
 *         description: カレンダー詳細の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       404:
 *         description: カレンダーが見つかりません
 *   put:
 *     summary: カレンダー更新
 *     description: 指定されたIDのカレンダー情報を更新します（管理者のみ）。同じ月に既に別のカレンダーが存在する場合は更新できません
 *     tags: [Calendars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: カレンダーID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCalendarRequest'
 *     responses:
 *       200:
 *         description: カレンダー更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 *       404:
 *         description: カレンダーが見つかりません
 * 
 * /api/coupons:
 *   get:
 *     summary: ユーザークーポン一覧取得
 *     description: 認証されたユーザーのクーポン情報を取得します
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: クーポン一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CouponList'
 *       401:
 *         description: 認証が必要
 *       404:
 *         description: クーポンが見つかりません
 *   post:
 *     summary: クーポン作成
 *     description: 新しいクーポンを作成します（管理者のみ）
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCouponRequest'
 *     responses:
 *       201:
 *         description: クーポン作成成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 * 
 * /api/coupons/all:
 *   get:
 *     summary: 全クーポン一覧取得（管理者のみ）
 *     description: すべてのクーポン情報を取得します（管理者のみ）
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: クーポン一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CouponList'
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 *       404:
 *         description: クーポンが見つかりません
 * 
 * /api/coupons/{id}:
 *   get:
 *     summary: クーポン詳細取得
 *     description: 指定されたIDのクーポン情報を取得します
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: クーポンID
 *     responses:
 *       200:
 *         description: クーポン詳細の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: クーポンが見つかりません
 *   put:
 *     summary: クーポン更新
 *     description: 指定されたIDのクーポン情報を更新します（管理者のみ）
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: クーポンID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCouponRequest'
 *     responses:
 *       200:
 *         description: クーポン更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       403:
 *         description: 管理者権限が必要
 *       404:
 *         description: クーポンが見つかりません
 * 
 * /api/coupons/{id}/use:
 *   post:
 *     summary: クーポン使用
 *     description: 指定されたIDのクーポンを使用します
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: クーポンID
 *     responses:
 *       200:
 *         description: クーポン使用成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UseCouponResponse'
 *       400:
 *         description: バリデーションエラー
 *       401:
 *         description: 認証が必要
 *       404:
 *         description: クーポンが見つかりません
 */ 