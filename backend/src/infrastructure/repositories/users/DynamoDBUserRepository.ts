import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { User } from '@/domain/entities/users/User';
import { UserRepository } from '@/domain/repositories/users/UserRepository';

export class DynamoDBUserRepository implements UserRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = 'Users';

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async findAll(): Promise<User[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items.map(item => new User(
        Number(item.id),
        item.name,
        item.email,
        item.password,
        item.address,
        item.telephoneNumber,
        item.gender,
        item.isAdmin === 'true',
        new Date(item.createdAt),
        new Date(item.updatedAt)
      ));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async findById(id: number): Promise<User | null> {
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
      return new User(
        Number(item.id),
        item.name,
        item.email,
        item.password,
        item.address,
        item.telephoneNumber,
        item.gender,
        item.isAdmin === 'true',
        new Date(item.createdAt),
        new Date(item.updatedAt)
      );
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      });

      const response = await this.client.send(command);
      
      if (!response.Items || response.Items.length === 0) {
        return null;
      }

      const item = response.Items[0];
      return new User(
        Number(item.id),
        item.name,
        item.email,
        item.password,
        item.address,
        item.telephoneNumber,
        item.gender,
        item.isAdmin === 'true',
        new Date(item.createdAt),
        new Date(item.updatedAt)
      );
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async create(userData: {
    name: string;
    email: string;
    password: string;
    address: string;
    telephoneNumber: string;
    gender: string;
    isAdmin: boolean;
  }): Promise<User> {
    try {
      // 新しいIDを生成（実際のプロダクションではUUIDを使用することを推奨）
      const newId = Date.now();
      const now = new Date().toISOString();

      const user = new User(
        newId,
        userData.name,
        userData.email,
        userData.password,
        userData.address,
        userData.telephoneNumber,
        userData.gender,
        userData.isAdmin,
        new Date(now),
        new Date(now)
      );

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: newId,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          address: userData.address,
          telephoneNumber: userData.telephoneNumber,
          gender: userData.gender,
          isAdmin: userData.isAdmin,
          createdAt: now,
          updatedAt: now
        }
      });

      await this.client.send(command);
      console.log(`✅ ユーザー作成完了: ID ${newId}`);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('ユーザーの作成に失敗しました');
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      const now = new Date().toISOString();
      const updateExpression: string[] = [];
      const expressionAttributeValues: any = {};

      // 更新可能なフィールドをチェック
      if (userData.name) {
        updateExpression.push('#name = :name');
        expressionAttributeValues[':name'] = userData.name;
      }
      if (userData.email) {
        updateExpression.push('#email = :email');
        expressionAttributeValues[':email'] = userData.email;
      }
      if (userData.password) {
        updateExpression.push('#password = :password');
        expressionAttributeValues[':password'] = userData.password;
      }
      if (userData.address) {
        updateExpression.push('#address = :address');
        expressionAttributeValues[':address'] = userData.address;
      }
      if (userData.telephoneNumber) {
        updateExpression.push('#telephoneNumber = :telephoneNumber');
        expressionAttributeValues[':telephoneNumber'] = userData.telephoneNumber;
      }
      if (userData.gender) {
        updateExpression.push('#gender = :gender');
        expressionAttributeValues[':gender'] = userData.gender;
      }
      if (userData.isAdmin !== undefined) {
        updateExpression.push('#isAdmin = :isAdmin');
        expressionAttributeValues[':isAdmin'] = userData.isAdmin;
      }

      // updatedAtを常に更新
      updateExpression.push('#updatedAt = :updatedAt');
      expressionAttributeValues[':updatedAt'] = now;

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id: id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: {
          '#name': 'name',
          '#email': 'email',
          '#password': 'password',
          '#address': 'address',
          '#telephoneNumber': 'telephoneNumber',
          '#gender': 'gender',
          '#isAdmin': 'isAdmin',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      });

      const response = await this.client.send(command);
      
      if (!response.Attributes) {
        return null;
      }

      const item = response.Attributes;
      return new User(
        Number(item.id),
        item.name,
        item.email,
        item.password,
        item.address,
        item.telephoneNumber,
        item.gender,
        item.isAdmin === 'true',
        new Date(item.createdAt),
        new Date(item.updatedAt)
      );
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
} 