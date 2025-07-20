const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  CreateTableCommand, 
  DescribeTableCommand, 
  PutItemCommand
} = require('@aws-sdk/client-dynamodb');

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

async function createOrdersTable() {
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

    // サンプルデータの挿入
    await insertSampleOrders();

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

if (require.main === module) {
  // タイムアウト設定（20秒）
  const timeout = setTimeout(() => {
    console.error('⏰ タイムアウト: 処理が20秒を超えました');
    process.exit(1);
  }, 20000);

  createOrdersTable()
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

module.exports = { createOrdersTable }; 