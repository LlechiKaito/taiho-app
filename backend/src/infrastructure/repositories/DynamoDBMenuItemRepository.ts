import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { MenuItem, CreateMenuItemData, UpdateMenuItemData } from '../../domain/entities/MenuItem';
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

  async findById(id: string): Promise<MenuItem | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    const response = await this.docClient.send(command);
    
    if (!response.Item) {
      return null;
    }

    return this.toDomainEntity(response.Item as DynamoDBMenuItem);
  }

  async findByCategory(category: string): Promise<MenuItem[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'category-index',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category,
      },
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

  async update(id: string, data: UpdateMenuItemData): Promise<MenuItem | null> {
    try {
      const updateExpressions: string[] = [];
      const expressionAttributeValues: any = {};
      const expressionAttributeNames: any = {};

      if (data.name !== undefined) {
        updateExpressions.push('#name = :name');
        expressionAttributeNames['#name'] = 'name';
        expressionAttributeValues[':name'] = data.name;
      }

      if (data.description !== undefined) {
        updateExpressions.push('description = :description');
        expressionAttributeValues[':description'] = data.description;
      }

      if (data.price !== undefined) {
        updateExpressions.push('price = :price');
        expressionAttributeValues[':price'] = data.price;
      }

      if (data.category !== undefined) {
        updateExpressions.push('category = :category');
        expressionAttributeValues[':category'] = data.category;
      }

      if (data.imageUrl !== undefined) {
        updateExpressions.push('imageUrl = :imageUrl');
        expressionAttributeValues[':imageUrl'] = data.imageUrl;
      }

      if (data.isAvailable !== undefined) {
        updateExpressions.push('isAvailable = :isAvailable');
        expressionAttributeValues[':isAvailable'] = data.isAvailable;
      }

      // updatedAtを常に更新
      updateExpressions.push('updatedAt = :updatedAt');
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      if (updateExpressions.length === 1) {
        // updatedAtのみの場合は更新しない
        return null;
      }

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ReturnValues: 'ALL_NEW',
      });

      const response = await this.docClient.send(command);
      
      if (!response.Attributes) {
        return null;
      }

      return this.toDomainEntity(response.Attributes as DynamoDBMenuItem);
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      });

      await this.docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
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