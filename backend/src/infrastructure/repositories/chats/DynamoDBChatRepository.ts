import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Chat } from '@/domain/entities/chats/Chat';
import { ChatRepository } from '@/domain/repositories/chats/ChatRepository';

export class DynamoDBChatRepository implements ChatRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = 'Chats';

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async findAll(): Promise<Chat[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new Chat(
        Number(item.id),
        Number(item.orderId),
        item.content
      ));
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  }

  async findByOrderId(orderId: number): Promise<Chat[]> {
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

      return response.Items.map(item => new Chat(
        Number(item.id),
        Number(item.orderId),
        item.content
      ));
    } catch (error) {
      console.error('Error fetching chats by order id:', error);
      return [];
    }
  }
} 