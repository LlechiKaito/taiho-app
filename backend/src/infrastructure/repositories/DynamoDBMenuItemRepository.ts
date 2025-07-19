import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { MenuItem, CreateMenuItemData } from '../../domain/entities/MenuItem';
import { MenuItemRepository } from '../../domain/repositories/MenuItemRepository';
import { randomUUID } from 'crypto';

interface DynamoDBMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export class DynamoDBMenuItemRepository implements MenuItemRepository {
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
    this.tableName = process.env.DYNAMODB_TABLE_NAME || 'menu-items';
  }

  async findAll(): Promise<MenuItem[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.docClient.send(command);
    
    if (!response.Items) {
      return [];
    }

    return response.Items
      .map(item => this.toDomainEntity(item as DynamoDBMenuItem))
      .sort((a: MenuItem, b: MenuItem) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(data: CreateMenuItemData): Promise<MenuItem> {
    const now = new Date();
    const item = {
      id: randomUUID(),
      name: data.name,
      description: data.description || null,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl || null,
      isAvailable: data.isAvailable ?? true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });

    await this.docClient.send(command);
    
    return this.toDomainEntity(item);
  }

  private toDomainEntity(item: DynamoDBMenuItem): MenuItem {
    return new MenuItem(
      item.id,
      item.name,
      item.description,
      item.price,
      item.category,
      item.imageUrl,
      item.isAvailable,
      new Date(item.createdAt),
      new Date(item.updatedAt)
    );
  }
} 