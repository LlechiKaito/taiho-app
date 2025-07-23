import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Calendar } from '@/domain/entities/calendars/Calendar';
import { CalendarRepository } from '@/domain/repositories/calendars/CalendarRepository';

export class DynamoDBCalendarRepository implements CalendarRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = 'Calendars';

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async findAll(): Promise<Calendar[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new Calendar(
        Number(item.id),
        item.photoUrl,
        Number(item.timestamp)
      ));
    } catch (error) {
      console.error('Error fetching calendars:', error);
      return [];
    }
  }

  async findById(id: number): Promise<Calendar | null> {
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
      return new Calendar(
        Number(item.id),
        item.photoUrl,
        Number(item.timestamp)
      );
    } catch (error) {
      console.error('Error fetching calendar by id:', error);
      return null;
    }
  }

  async findByMonth(year: number, month: number): Promise<Calendar[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      // 指定された年月のカレンダーをフィルタリング
      const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0).getTime();
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();

      return response.Items
        .map(item => new Calendar(
          Number(item.id),
          item.photoUrl,
          Number(item.timestamp)
        ))
        .filter(calendar => calendar.timestamp >= startOfMonth && calendar.timestamp <= endOfMonth);
    } catch (error) {
      console.error('Error fetching calendars by month:', error);
      return [];
    }
  }

  async create(calendar: Omit<Calendar, 'id'>): Promise<Calendar> {
    try {
      // 新しいIDを生成（簡易的な実装）
      const existingCalendars = await this.findAll();
      const newId = existingCalendars.length > 0 ? Math.max(...existingCalendars.map(c => c.id)) + 1 : 1;

      const newCalendar = new Calendar(
        newId,
        calendar.photoUrl,
        calendar.timestamp
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: newCalendar.id,
          photoUrl: newCalendar.photoUrl,
          timestamp: newCalendar.timestamp
        }
      });

      await this.client.send(command);
      return newCalendar;
    } catch (error) {
      console.error('Error creating calendar:', error);
      throw new Error('カレンダーの作成に失敗しました');
    }
  }

  async update(id: number, calendar: Partial<Omit<Calendar, 'id'>>): Promise<Calendar | null> {
    try {
      // 既存のカレンダーを取得
      const existingCalendar = await this.findById(id);
      if (!existingCalendar) {
        return null;
      }

      // 更新データを準備
      const updatedPhotoUrl = calendar.photoUrl !== undefined ? calendar.photoUrl : existingCalendar.photoUrl;
      const updatedTimestamp = calendar.timestamp !== undefined ? calendar.timestamp : existingCalendar.timestamp;

      const updatedCalendar = new Calendar(
        id,
        updatedPhotoUrl,
        updatedTimestamp
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: updatedCalendar.id,
          photoUrl: updatedCalendar.photoUrl,
          timestamp: updatedCalendar.timestamp
        }
      });

      await this.client.send(command);
      return updatedCalendar;
    } catch (error) {
      console.error('Error updating calendar:', error);
      throw new Error('カレンダーの更新に失敗しました');
    }
  }
} 