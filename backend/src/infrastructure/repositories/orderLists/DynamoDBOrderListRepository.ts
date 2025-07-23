import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { OrderList } from '@/domain/entities/orderLists/OrderList';
import { OrderListRepository } from '@/domain/repositories/orderLists/OrderListRepository';

export class DynamoDBOrderListRepository implements OrderListRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = 'OrderLists';

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async findAll(): Promise<OrderList[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new OrderList(
        Number(item.id),
        Number(item.orderId),
        Number(item.itemId),
        Number(item.quantity || 1)
      ));
    } catch (error) {
      console.error('Error fetching order lists:', error);
      return [];
    }
  }

  async findByOrderId(orderId: number): Promise<OrderList[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'orderId = :orderId',
        ExpressionAttributeValues: {
          ':orderId': orderId,
        },
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new OrderList(
        Number(item.id),
        Number(item.orderId),
        Number(item.itemId),
        Number(item.quantity || 1)
      ));
    } catch (error) {
      console.error('Error fetching order lists by order id:', error);
      return [];
    }
  }

  async create(orderList: Omit<OrderList, 'id'>): Promise<OrderList> {
    try {
      // 新しいIDを生成（簡易的な実装）
      const existingOrderLists = await this.findAll();
      const newId = existingOrderLists.length > 0 ? Math.max(...existingOrderLists.map(ol => ol.id)) + 1 : 1;

      const newOrderList = new OrderList(
        newId,
        orderList.orderId,
        orderList.itemId,
        orderList.quantity
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: newOrderList.id,
          orderId: newOrderList.orderId,
          itemId: newOrderList.itemId,
          quantity: newOrderList.quantity
        }
      });

      await this.client.send(command);
      return newOrderList;
    } catch (error) {
      console.error('Error creating order list:', error);
      throw new Error('注文明細の作成に失敗しました');
    }
  }
} 