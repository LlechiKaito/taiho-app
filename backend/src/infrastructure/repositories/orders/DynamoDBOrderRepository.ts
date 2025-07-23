import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Order } from '@/domain/entities/orders/Order';
import { OrderRepository } from '@/domain/repositories/orders/OrderRepository';

interface DynamoDBOrder {
  id: number;
  userId: number;
  isCooked: boolean;
  isPayment: boolean;
  isTakeOut: boolean;
  createdAt: string;
  description: string;
  isComplete: boolean;
}

export class DynamoDBOrderRepository implements OrderRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    const config: any = {
      region: process.env.AWS_REGION || 'ap-northeast-1',
    };

    // ローカル開発環境の場合
    if (process.env.DYNAMODB_ENDPOINT) {
      config.endpoint = process.env.DYNAMODB_ENDPOINT;
      // DynamoDB Local用のダミー認証情報
      config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
      };
    } else {
      // AWS環境の場合、認証情報を明示的に設定（必要に応じて）
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        config.credentials = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        };
      }
    }

    const dynamoDBClient = new DynamoDBClient(config);
    this.docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    this.tableName = process.env.DYNAMODB_ORDERS_TABLE_NAME || 'orders';
  }

  async findAll(): Promise<Order[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.docClient.send(command);
    
    if (!response.Items) {
      return [];
    }

    return response.Items
      .map(item => this.toDomainEntity(item as DynamoDBOrder))
      .sort((a: Order, b: Order) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: number): Promise<Order | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id: id },
      });

      const response = await this.docClient.send(command);
      
      if (!response.Item) {
        return null;
      }

      return this.toDomainEntity(response.Item as DynamoDBOrder);
    } catch (error) {
      console.error('Error fetching order by id:', error);
      return null;
    }
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    try {
      // 新しいIDを生成（簡易的な実装）
      const existingOrders = await this.findAll();
      const newId = existingOrders.length > 0 ? Math.max(...existingOrders.map(o => o.id)) + 1 : 1;

      const newOrder = new Order(
        newId,
        order.userId,
        order.isCooked,
        order.isPayment,
        order.isTakeOut,
        order.createdAt,
        order.description,
        order.isComplete
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: newOrder.id,
          userId: newOrder.userId,
          isCooked: newOrder.isCooked,
          isPayment: newOrder.isPayment,
          isTakeOut: newOrder.isTakeOut,
          createdAt: newOrder.createdAt.toISOString(),
          description: newOrder.description,
          isComplete: newOrder.isComplete
        }
      });

      await this.docClient.send(command);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('注文の作成に失敗しました');
    }
  }

  private toDomainEntity(item: DynamoDBOrder): Order {
    return new Order(
      item.id,
      item.userId,
      item.isCooked,
      item.isPayment,
      item.isTakeOut,
      new Date(item.createdAt),
      item.description,
      item.isComplete
    );
  }
} 