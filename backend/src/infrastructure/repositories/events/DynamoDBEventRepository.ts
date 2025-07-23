import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Event } from '@/domain/entities/events/Event';
import { EventRepository } from '@/domain/repositories/events/EventRepository';

export class DynamoDBEventRepository implements EventRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = 'Events';

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async findAll(): Promise<Event[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new Event(
        Number(item.id),
        item.photoUrl,
        Number(item.priority || 0)
      ));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async findById(id: number): Promise<Event | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id: id },
      });

      const response = await this.client.send(command);
      
      if (!response.Item) {
        return null;
      }

      const item = response.Item;
      return new Event(
        Number(item.id),
        item.photoUrl,
        Number(item.priority || 0)
      );
    } catch (error) {
      console.error('Error fetching event by id:', error);
      return null;
    }
  }

  async create(event: Omit<Event, 'id'>): Promise<Event> {
    try {
      // 新しいIDを生成（簡易的な実装）
      const existingEvents = await this.findAll();
      const newId = existingEvents.length > 0 ? Math.max(...existingEvents.map(e => e.id)) + 1 : 1;

      const newEvent = new Event(
        newId,
        event.photoUrl,
        event.priority
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: newEvent.id,
          photoUrl: newEvent.photoUrl,
          priority: newEvent.priority
        }
      });

      await this.client.send(command);
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('イベントの作成に失敗しました');
    }
  }

  async update(id: number, event: Partial<Omit<Event, 'id'>>): Promise<Event | null> {
    try {
      // 既存のイベントを取得
      const existingEvent = await this.findById(id);
      if (!existingEvent) {
        return null;
      }

      // 更新データを準備
      const updatedPhotoUrl = event.photoUrl !== undefined ? event.photoUrl : existingEvent.photoUrl;
      const updatedPriority = event.priority !== undefined ? event.priority : existingEvent.priority;

      const updatedEvent = new Event(
        id,
        updatedPhotoUrl,
        updatedPriority
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: updatedEvent.id,
          photoUrl: updatedEvent.photoUrl,
          priority: updatedEvent.priority
        }
      });

      await this.client.send(command);
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('イベントの更新に失敗しました');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // 既存のイベントを確認
      const existingEvent = await this.findById(id);
      if (!existingEvent) {
        return false;
      }

      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id: id }
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('イベントの削除に失敗しました');
    }
  }
} 