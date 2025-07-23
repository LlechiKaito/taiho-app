import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Coupon } from '@/domain/entities/coupons/Coupon';
import { CouponRepository } from '@/domain/repositories/coupons/CouponRepository';

export class DynamoDBCouponRepository implements CouponRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = 'Coupons';

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async findAll(): Promise<Coupon[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new Coupon(
        Number(item.id),
        Number(item.userId),
        item.code,
        Number(item.discountAmount),
        item.discountType,
        Boolean(item.isUsed),
        new Date(item.expiresAt),
        new Date(item.createdAt)
      ));
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  }

  async findById(id: number): Promise<Coupon | null> {
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
      return new Coupon(
        Number(item.id),
        Number(item.userId),
        item.code,
        Number(item.discountAmount),
        item.discountType,
        Boolean(item.isUsed),
        new Date(item.expiresAt),
        new Date(item.createdAt)
      );
    } catch (error) {
      console.error('Error fetching coupon by id:', error);
      return null;
    }
  }

  async findByUserId(userId: number): Promise<Coupon[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new Coupon(
        Number(item.id),
        Number(item.userId),
        item.code,
        Number(item.discountAmount),
        item.discountType,
        Boolean(item.isUsed),
        new Date(item.expiresAt),
        new Date(item.createdAt)
      ));
    } catch (error) {
      console.error('Error fetching coupons by user id:', error);
      return [];
    }
  }

  async findByCode(code: string): Promise<Coupon | null> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'code = :code',
        ExpressionAttributeValues: {
          ':code': code,
        },
      });

      const response = await this.client.send(command);
      
      if (!response.Items || response.Items.length === 0) {
        return null;
      }

      const item = response.Items[0];
      return new Coupon(
        Number(item.id),
        Number(item.userId),
        item.code,
        Number(item.discountAmount),
        item.discountType,
        Boolean(item.isUsed),
        new Date(item.expiresAt),
        new Date(item.createdAt)
      );
    } catch (error) {
      console.error('Error fetching coupon by code:', error);
      return null;
    }
  }

  async create(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
    try {
      // 新しいIDを生成（簡易的な実装）
      const existingCoupons = await this.findAll();
      const newId = existingCoupons.length > 0 ? Math.max(...existingCoupons.map(c => c.id)) + 1 : 1;

      const newCoupon = new Coupon(
        newId,
        coupon.userId,
        coupon.code,
        coupon.discountAmount,
        coupon.discountType,
        coupon.isUsed,
        coupon.expiresAt,
        coupon.createdAt
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: newCoupon.id,
          userId: newCoupon.userId,
          code: newCoupon.code,
          discountAmount: newCoupon.discountAmount,
          discountType: newCoupon.discountType,
          isUsed: newCoupon.isUsed,
          expiresAt: newCoupon.expiresAt.toISOString(),
          createdAt: newCoupon.createdAt.toISOString()
        }
      });

      await this.client.send(command);
      return newCoupon;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw new Error('クーポンの作成に失敗しました');
    }
  }

  async update(id: number, coupon: Partial<Omit<Coupon, 'id'>>): Promise<Coupon | null> {
    try {
      // 既存のクーポンを取得
      const existingCoupon = await this.findById(id);
      if (!existingCoupon) {
        return null;
      }

      // 更新データを準備
      const updatedUserId = coupon.userId !== undefined ? coupon.userId : existingCoupon.userId;
      const updatedCode = coupon.code !== undefined ? coupon.code : existingCoupon.code;
      const updatedDiscountAmount = coupon.discountAmount !== undefined ? coupon.discountAmount : existingCoupon.discountAmount;
      const updatedDiscountType = coupon.discountType !== undefined ? coupon.discountType : existingCoupon.discountType;
      const updatedIsUsed = coupon.isUsed !== undefined ? coupon.isUsed : existingCoupon.isUsed;
      const updatedExpiresAt = coupon.expiresAt !== undefined ? coupon.expiresAt : existingCoupon.expiresAt;
      const updatedCreatedAt = coupon.createdAt !== undefined ? coupon.createdAt : existingCoupon.createdAt;

      const updatedCoupon = new Coupon(
        id,
        updatedUserId,
        updatedCode,
        updatedDiscountAmount,
        updatedDiscountType,
        updatedIsUsed,
        updatedExpiresAt,
        updatedCreatedAt
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: updatedCoupon.id,
          userId: updatedCoupon.userId,
          code: updatedCoupon.code,
          discountAmount: updatedCoupon.discountAmount,
          discountType: updatedCoupon.discountType,
          isUsed: updatedCoupon.isUsed,
          expiresAt: updatedCoupon.expiresAt.toISOString(),
          createdAt: updatedCoupon.createdAt.toISOString()
        }
      });

      await this.client.send(command);
      return updatedCoupon;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw new Error('クーポンの更新に失敗しました');
    }
  }

  async useCoupon(id: number): Promise<Coupon | null> {
    try {
      const coupon = await this.findById(id);
      if (!coupon) {
        return null;
      }

      if (coupon.isUsed) {
        throw new Error('このクーポンは既に使用済みです');
      }

      if (new Date() > coupon.expiresAt) {
        throw new Error('このクーポンは期限切れです');
      }

      const updatedCoupon = new Coupon(
        coupon.id,
        coupon.userId,
        coupon.code,
        coupon.discountAmount,
        coupon.discountType,
        true, // isUsedをtrueに設定
        coupon.expiresAt,
        coupon.createdAt
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: updatedCoupon.id,
          userId: updatedCoupon.userId,
          code: updatedCoupon.code,
          discountAmount: updatedCoupon.discountAmount,
          discountType: updatedCoupon.discountType,
          isUsed: updatedCoupon.isUsed,
          expiresAt: updatedCoupon.expiresAt.toISOString(),
          createdAt: updatedCoupon.createdAt.toISOString()
        }
      });

      await this.client.send(command);
      return updatedCoupon;
    } catch (error) {
      console.error('Error using coupon:', error);
      throw error;
    }
  }
} 