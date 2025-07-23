const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  CreateTableCommand, 
  DescribeTableCommand, 
  PutItemCommand
} = require('@aws-sdk/client-dynamodb');
const bcrypt = require('bcryptjs');

const config = {
  region: process.env.AWS_REGION || 'ap-northeast-1',
  requestTimeout: 10000,
  connectionTimeout: 10000,
};

// ローカル開発環境の場合
if (process.env.DYNAMODB_ENDPOINT) {
  config.endpoint = process.env.DYNAMODB_ENDPOINT;
  // DynamoDB Local用のダミー認証情報
  config.credentials = {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  };
  // Docker環境での接続を改善
  config.maxAttempts = 3;
  config.retryMode = 'adaptive';
  console.log(`🔗 DynamoDB Local接続先: ${config.endpoint}`);
} else {
  // AWS環境の場合、認証情報を明示的に設定（必要に応じて）
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }
  console.log(`🔗 AWS DynamoDB接続先: ${process.env.AWS_REGION}`);
}

const dynamoDBClient = new DynamoDBClient(config);

const ORDERS_TABLE_NAME = process.env.DYNAMODB_ORDERS_TABLE_NAME || 'orders';
const USERS_TABLE_NAME = 'Users';
const ORDER_LISTS_TABLE_NAME = 'OrderLists';
const CHATS_TABLE_NAME = 'Chats';
const EVENTS_TABLE_NAME = 'Events';
const CALENDARS_TABLE_NAME = 'Calendars';

async function createAllTables() {
  try {
    console.log(`📊 DynamoDBテーブル "${ORDERS_TABLE_NAME}" の作成を開始します...`);
    
    // 環境変数の確認
    console.log('🔍 環境変数の確認:');
    console.log(`- AWS_REGION: ${process.env.AWS_REGION}`);
    console.log(`- DYNAMODB_ENDPOINT: ${process.env.DYNAMODB_ENDPOINT}`);
    console.log(`- DYNAMODB_ORDERS_TABLE_NAME: ${process.env.DYNAMODB_ORDERS_TABLE_NAME}`);
    console.log(`- AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not Set'}`);
    console.log(`- AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not Set'}`);

    // テーブルが既に存在するかチェック
    try {
      console.log('🔍 既存テーブルをチェック中...');
      const result = await dynamoDBClient.send(new DescribeTableCommand({
        TableName: ORDERS_TABLE_NAME
      }));
      console.log(`✅ テーブル "${ORDERS_TABLE_NAME}" は既に存在します`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        console.error('❌ テーブルチェックエラー:', error.message);
        console.error('エラーの詳細:', error.name, error.code);
        throw error;
      }
      console.log('📝 新しいテーブルを作成します...');
    }

    // テーブルを作成
    const createTableCommand = new CreateTableCommand({
      TableName: ORDERS_TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N'
        },
        {
          AttributeName: 'userId',
          AttributeType: 'N'
        },
        {
          AttributeName: 'createdAt',
          AttributeType: 'S'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userId-createdAt-index',
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'createdAt',
              KeyType: 'RANGE'
            }
          ],
          Projection: {
            ProjectionType: 'ALL'
          }
        }
      ]
    });

    console.log('🔨 テーブルを作成中...');
    await dynamoDBClient.send(createTableCommand);
    console.log(`✅ テーブル "${ORDERS_TABLE_NAME}" の作成リクエストを送信しました`);

    // DynamoDB Localでは即座にテーブルが利用可能になるため、少し待機
    console.log('⏳ 少し待機中...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`✅ テーブル "${ORDERS_TABLE_NAME}" が作成されました`);

    // 他のテーブルを作成
    await createUsersTable();
    await createOrderListsTable();
    await createChatsTable();
    await createEventsTable();
    await createCalendarsTable();

    // サンプルデータの挿入
    await insertSampleOrders();
    await insertSampleUsers();
    await insertSampleOrderLists();
    await insertSampleChats();
    await insertSampleEvents();
    await insertSampleCalendars();

  } catch (error) {
    console.error('❌ テーブル作成エラー:', error.message || error);
    console.error('エラー詳細:', error.name, error.code);
    if (error.stack) {
      console.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  }
}

async function insertSampleOrders() {
  console.log('⏳ サンプル注文データを挿入中...');
  
  let successCount = 0;
  
  const sampleOrders = [
    {
      id: { N: '1' },
      userId: { N: '1' },
      isCooked: { BOOL: false },
      isPayment: { BOOL: false },
      isTakeOut: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
      description: { S: '醤油ラーメン x1, 唐揚げ x1' },
      isComplete: { BOOL: false }
    },
    {
      id: { N: '2' },
      userId: { N: '2' },
      isCooked: { BOOL: true },
      isPayment: { BOOL: false },
      isTakeOut: { BOOL: false },
      createdAt: { S: new Date(Date.now() - 1000 * 60 * 30).toISOString() }, // 30分前
      description: { S: '味噌ラーメン x1, ビール x1' },
      isComplete: { BOOL: false }
    },
    {
      id: { N: '3' },
      userId: { N: '3' },
      isCooked: { BOOL: true },
      isPayment: { BOOL: true },
      isTakeOut: { BOOL: true },
      createdAt: { S: new Date(Date.now() - 1000 * 60 * 60).toISOString() }, // 1時間前
      description: { S: 'チャーハン x1, 餃子 x1' },
      isComplete: { BOOL: false }
    },
    {
      id: { N: '4' },
      userId: { N: '1' },
      isCooked: { BOOL: true },
      isPayment: { BOOL: true },
      isTakeOut: { BOOL: false },
      createdAt: { S: new Date(Date.now() - 1000 * 60 * 120).toISOString() }, // 2時間前
      description: { S: '醤油ラーメン x2' },
      isComplete: { BOOL: true }
    }
  ];

  for (const order of sampleOrders) {
    try {
      await dynamoDBClient.send(new PutItemCommand({
        TableName: ORDERS_TABLE_NAME,
        Item: order
      }));
      console.log(`✅ サンプル注文データ挿入: ID ${order.id.N}`);
      successCount++;
    } catch (error) {
      console.error(`❌ サンプル注文データ挿入エラー (ID ${order.id.N}):`, error.message || error);
    }
  }
  
  console.log(`📊 サンプル注文データ挿入完了: ${successCount}/${sampleOrders.length} 件成功`);
}

async function createUsersTable() {
  try {
    console.log(`📊 DynamoDBテーブル "${USERS_TABLE_NAME}" の作成を開始します...`);
    
    // テーブルが既に存在するかチェック
    try {
      const result = await dynamoDBClient.send(new DescribeTableCommand({
        TableName: USERS_TABLE_NAME
      }));
      console.log(`✅ テーブル "${USERS_TABLE_NAME}" は既に存在します`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // テーブルを作成
    const createTableCommand = new CreateTableCommand({
      TableName: USERS_TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });

    await dynamoDBClient.send(createTableCommand);
    console.log(`✅ テーブル "${USERS_TABLE_NAME}" が作成されました`);
  } catch (error) {
    console.error('❌ Usersテーブル作成エラー:', error.message);
  }
}

async function createOrderListsTable() {
  try {
    console.log(`📊 DynamoDBテーブル "${ORDER_LISTS_TABLE_NAME}" の作成を開始します...`);
    
    // テーブルが既に存在するかチェック
    try {
      const result = await dynamoDBClient.send(new DescribeTableCommand({
        TableName: ORDER_LISTS_TABLE_NAME
      }));
      console.log(`✅ テーブル "${ORDER_LISTS_TABLE_NAME}" は既に存在します`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // テーブルを作成
    const createTableCommand = new CreateTableCommand({
      TableName: ORDER_LISTS_TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });

    await dynamoDBClient.send(createTableCommand);
    console.log(`✅ テーブル "${ORDER_LISTS_TABLE_NAME}" が作成されました`);
  } catch (error) {
    console.error('❌ OrderListsテーブル作成エラー:', error.message);
  }
}

async function createChatsTable() {
  try {
    console.log(`📊 DynamoDBテーブル "${CHATS_TABLE_NAME}" の作成を開始します...`);
    
    // テーブルが既に存在するかチェック
    try {
      const result = await dynamoDBClient.send(new DescribeTableCommand({
        TableName: CHATS_TABLE_NAME
      }));
      console.log(`✅ テーブル "${CHATS_TABLE_NAME}" は既に存在します`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // テーブルを作成
    const createTableCommand = new CreateTableCommand({
      TableName: CHATS_TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });

    await dynamoDBClient.send(createTableCommand);
    console.log(`✅ テーブル "${CHATS_TABLE_NAME}" が作成されました`);
  } catch (error) {
    console.error('❌ Chatsテーブル作成エラー:', error.message);
  }
}

async function createEventsTable() {
  try {
    console.log(`📊 DynamoDBテーブル "${EVENTS_TABLE_NAME}" の作成を開始します...`);
    
    // テーブルが既に存在するかチェック
    try {
      const result = await dynamoDBClient.send(new DescribeTableCommand({
        TableName: EVENTS_TABLE_NAME
      }));
      console.log(`✅ テーブル "${EVENTS_TABLE_NAME}" は既に存在します`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // テーブルを作成
    const createTableCommand = new CreateTableCommand({
      TableName: EVENTS_TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });

    await dynamoDBClient.send(createTableCommand);
    console.log(`✅ テーブル "${EVENTS_TABLE_NAME}" が作成されました`);
  } catch (error) {
    console.error('❌ Eventsテーブル作成エラー:', error.message);
  }
}

async function createCalendarsTable() {
  try {
    console.log(`📊 DynamoDBテーブル "${CALENDARS_TABLE_NAME}" の作成を開始します...`);
    
    // テーブルが既に存在するかチェック
    try {
      const result = await dynamoDBClient.send(new DescribeTableCommand({
        TableName: CALENDARS_TABLE_NAME
      }));
      console.log(`✅ テーブル "${CALENDARS_TABLE_NAME}" は既に存在します`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // テーブルを作成
    const createTableCommand = new CreateTableCommand({
      TableName: CALENDARS_TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });

    await dynamoDBClient.send(createTableCommand);
    console.log(`✅ テーブル "${CALENDARS_TABLE_NAME}" が作成されました`);
  } catch (error) {
    console.error('❌ Calendarsテーブル作成エラー:', error.message);
  }
}

async function insertSampleUsers() {
  console.log('⏳ サンプルユーザーデータを挿入中...');
  
  // パスワードをハッシュ化
  const saltRounds = 10;
  const hashedPassword1 = await bcrypt.hash('password123', saltRounds);
  const hashedPassword2 = await bcrypt.hash('password123', saltRounds);
  const hashedPassword3 = await bcrypt.hash('admin123', saltRounds);
  
  const sampleUsers = [
    {
      id: { N: '1' },
      name: { S: '田中太郎' },
      email: { S: 'tanaka@example.com' },
      password: { S: hashedPassword1 },
      address: { S: '東京都渋谷区1-1-1' },
      telephoneNumber: { S: '03-1234-5678' },
      gender: { S: '男性' },
      isAdmin: { S: 'false' },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    },
    {
      id: { N: '2' },
      name: { S: '佐藤花子' },
      email: { S: 'sato@example.com' },
      password: { S: hashedPassword2 },
      address: { S: '東京都新宿区2-2-2' },
      telephoneNumber: { S: '03-2345-6789' },
      gender: { S: '女性' },
      isAdmin: { S: 'false' },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    },
    {
      id: { N: '3' },
      name: { S: '管理者' },
      email: { S: 'admin@example.com' },
      password: { S: hashedPassword3 },
      address: { S: '東京都港区3-3-3' },
      telephoneNumber: { S: '03-3456-7890' },
      gender: { S: '男性' },
      isAdmin: { S: 'true' },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    }
  ];

  for (const user of sampleUsers) {
    try {
      await dynamoDBClient.send(new PutItemCommand({
        TableName: USERS_TABLE_NAME,
        Item: user
      }));
      console.log(`✅ サンプルユーザーデータ挿入: ID ${user.id.N}`);
    } catch (error) {
      console.error(`❌ サンプルユーザーデータ挿入エラー (ID ${user.id.N}):`, error.message);
    }
  }
  
  console.log('📊 サンプルユーザーデータ挿入完了');
}

async function insertSampleOrderLists() {
  console.log('⏳ サンプル注文明細データを挿入中...');
  
  const sampleOrderLists = [
    {
      id: { N: '1' },
      orderId: { N: '1' },
      itemId: { N: '1' },
      quantity: { N: '1' }
    },
    {
      id: { N: '2' },
      orderId: { N: '1' },
      itemId: { N: '2' },
      quantity: { N: '1' }
    },
    {
      id: { N: '3' },
      orderId: { N: '2' },
      itemId: { N: '3' },
      quantity: { N: '1' }
    },
    {
      id: { N: '4' },
      orderId: { N: '2' },
      itemId: { N: '4' },
      quantity: { N: '1' }
    }
  ];

  for (const orderList of sampleOrderLists) {
    try {
      await dynamoDBClient.send(new PutItemCommand({
        TableName: ORDER_LISTS_TABLE_NAME,
        Item: orderList
      }));
      console.log(`✅ サンプル注文明細データ挿入: ID ${orderList.id.N}`);
    } catch (error) {
      console.error(`❌ サンプル注文明細データ挿入エラー (ID ${orderList.id.N}):`, error.message);
    }
  }
  
  console.log('📊 サンプル注文明細データ挿入完了');
}

async function insertSampleChats() {
  console.log('⏳ サンプルチャットデータを挿入中...');
  
  const sampleChats = [
    {
      id: { N: '1' },
      orderId: { N: '1' },
      content: { S: '注文の確認をお願いします' }
    },
    {
      id: { N: '2' },
      orderId: { N: '1' },
      content: { S: '承知いたしました。調理を開始いたします' }
    },
    {
      id: { N: '3' },
      orderId: { N: '2' },
      content: { S: '調理が完了しました' }
    }
  ];

  for (const chat of sampleChats) {
    try {
      await dynamoDBClient.send(new PutItemCommand({
        TableName: CHATS_TABLE_NAME,
        Item: chat
      }));
      console.log(`✅ サンプルチャットデータ挿入: ID ${chat.id.N}`);
    } catch (error) {
      console.error(`❌ サンプルチャットデータ挿入エラー (ID ${chat.id.N}):`, error.message);
    }
  }
  
  console.log('📊 サンプルチャットデータ挿入完了');
}

async function insertSampleEvents() {
  console.log('⏳ サンプルイベントデータを挿入中...');
  
  const sampleEvents = [
    {
      id: { N: '1' },
      photoUrl: { S: 'https://example.com/event1.jpg' }
    },
    {
      id: { N: '2' },
      photoUrl: { S: 'https://example.com/event2.jpg' }
    },
    {
      id: { N: '3' },
      photoUrl: { S: 'https://example.com/event3.jpg' }
    }
  ];

  for (const event of sampleEvents) {
    try {
      await dynamoDBClient.send(new PutItemCommand({
        TableName: EVENTS_TABLE_NAME,
        Item: event
      }));
      console.log(`✅ サンプルイベントデータ挿入: ID ${event.id.N}`);
    } catch (error) {
      console.error(`❌ サンプルイベントデータ挿入エラー (ID ${event.id.N}):`, error.message);
    }
  }
  
  console.log('📊 サンプルイベントデータ挿入完了');
}

async function insertSampleCalendars() {
  console.log('⏳ サンプルカレンダーデータを挿入中...');
  
  const sampleCalendars = [
    {
      id: { N: '1' },
      photoUrl: { S: 'https://example.com/calendar1.jpg' },
      timestamp: { N: Date.now().toString() }
    },
    {
      id: { N: '2' },
      photoUrl: { S: 'https://example.com/calendar2.jpg' },
      timestamp: { N: (Date.now() + 86400000).toString() } // 1日後
    },
    {
      id: { N: '3' },
      photoUrl: { S: 'https://example.com/calendar3.jpg' },
      timestamp: { N: (Date.now() + 172800000).toString() } // 2日後
    }
  ];

  for (const calendar of sampleCalendars) {
    try {
      await dynamoDBClient.send(new PutItemCommand({
        TableName: CALENDARS_TABLE_NAME,
        Item: calendar
      }));
      console.log(`✅ サンプルカレンダーデータ挿入: ID ${calendar.id.N}`);
    } catch (error) {
      console.error(`❌ サンプルカレンダーデータ挿入エラー (ID ${calendar.id.N}):`, error.message);
    }
  }
  
  console.log('📊 サンプルカレンダーデータ挿入完了');
}

if (require.main === module) {
  // タイムアウト設定（20秒）
  const timeout = setTimeout(() => {
    console.error('⏰ タイムアウト: 処理が20秒を超えました');
    process.exit(1);
  }, 20000);

  createAllTables()
    .then(() => {
      clearTimeout(timeout);
      console.log('🎉 処理が完了しました');
      process.exit(0);
    })
    .catch((error) => {
      clearTimeout(timeout);
      console.error('💥 処理が失敗しました:', error);
      process.exit(1);
    });
}

module.exports = { createAllTables }; 