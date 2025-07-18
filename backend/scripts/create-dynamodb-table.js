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

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'menu-items';

async function createTable() {
  try {
    console.log(`📊 DynamoDBテーブル "${TABLE_NAME}" の作成を開始します...`);
    
    // 環境変数の確認
    console.log('🔍 環境変数の確認:');
    console.log(`- AWS_REGION: ${process.env.AWS_REGION}`);
    console.log(`- DYNAMODB_ENDPOINT: ${process.env.DYNAMODB_ENDPOINT}`);
    console.log(`- DYNAMODB_TABLE_NAME: ${process.env.DYNAMODB_TABLE_NAME}`);
    console.log(`- AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not Set'}`);
    console.log(`- AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not Set'}`);

    // テーブルが既に存在するかチェック
    try {
      console.log('🔍 既存テーブルをチェック中...');
      const result = await dynamoDBClient.send(new DescribeTableCommand({
        TableName: TABLE_NAME
      }));
      console.log(`✅ テーブル "${TABLE_NAME}" は既に存在します`);
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
      TableName: TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S'
        },
        {
          AttributeName: 'category',
          AttributeType: 'S'
        },
        {
          AttributeName: 'createdAt',
          AttributeType: 'S'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'category-index',
          KeySchema: [
            {
              AttributeName: 'category',
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
    console.log(`✅ テーブル "${TABLE_NAME}" の作成リクエストを送信しました`);

    // DynamoDB Localでは即座にテーブルが利用可能になるため、少し待機
    console.log('⏳ 少し待機中...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`✅ テーブル "${TABLE_NAME}" が作成されました`);

    // サンプルデータの挿入
    await insertSampleData();

  } catch (error) {
    console.error('❌ テーブル作成エラー:', error.message || error);
    console.error('エラー詳細:', error.name, error.code);
    if (error.stack) {
      console.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  }
}

async function insertSampleData() {
  console.log('⏳ サンプルデータを挿入中...');
  
  let successCount = 0;
  
  const sampleItems = [
    {
      id: { S: '1' },
      name: { S: '醤油ラーメン' },
      description: { S: '醤油ベースの定番ラーメン' },
      price: { N: '800' },
      category: { S: 'ラーメン' },
      imageUrl: { S: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
      isAvailable: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    },
    {
      id: { S: '2' },
      name: { S: '味噌ラーメン' },
      description: { S: '味噌ベースの濃厚ラーメン' },
      price: { N: '850' },
      category: { S: 'ラーメン' },
      imageUrl: { S: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop' },
      isAvailable: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    },
    {
      id: { S: '3' },
      name: { S: 'チャーハン' },
      description: { S: '香ばしい炒飯' },
      price: { N: '700' },
      category: { S: 'ご飯もの' },
      imageUrl: { S: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
      isAvailable: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    },
    {
      id: { S: '4' },
      name: { S: '唐揚げ' },
      description: { S: 'ジューシーな鶏の唐揚げ' },
      price: { N: '600' },
      category: { S: 'サイドメニュー' },
      imageUrl: { S: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=300&fit=crop' },
      isAvailable: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    },
    {
      id: { S: '5' },
      name: { S: '餃子' },
      description: { S: '手作りの焼き餃子' },
      price: { N: '500' },
      category: { S: 'サイドメニュー' },
      imageUrl: { S: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
      isAvailable: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    },
    {
      id: { S: '6' },
      name: { S: 'ビール' },
      description: { S: 'キンキンに冷えたビール' },
      price: { N: '400' },
      category: { S: 'ドリンク' },
      imageUrl: { S: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop' },
      isAvailable: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    }
  ];

  for (const item of sampleItems) {
    try {
      await dynamoDBClient.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: item
      }));
      console.log(`✅ サンプルデータ挿入: ${item.name.S}`);
      successCount++;
    } catch (error) {
      console.error(`❌ サンプルデータ挿入エラー (${item.name.S}):`, error.message || error);
    }
  }
  
  console.log(`📊 サンプルデータ挿入完了: ${successCount}/${sampleItems.length} 件成功`);
}

if (require.main === module) {
  // タイムアウト設定（20秒）
  const timeout = setTimeout(() => {
    console.error('⏰ タイムアウト: 処理が20秒を超えました');
    process.exit(1);
  }, 20000);

  createTable()
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

module.exports = { createTable }; 