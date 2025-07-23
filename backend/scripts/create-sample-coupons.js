const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local'
  }
});

const docClient = DynamoDBDocumentClient.from(client);

const createCouponsTable = async () => {
  try {
    console.log('📊 Couponsテーブルの作成を開始します...');
    
    // テーブル作成
    const createTableCommand = new CreateTableCommand({
      TableName: 'Coupons',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'N' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });

    await docClient.send(createTableCommand);
    console.log('✅ Couponsテーブルを作成しました');
    
    // 少し待機してテーブルが作成されるのを待つ
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📊 クーポンデータの作成を開始します...');
    
    const coupons = [
      {
        id: 1,
        userId: 1,
        code: 'SAVE20',
        discountAmount: 20,
        discountType: 'percentage',
        isUsed: false,
        expiresAt: '2025-12-31T23:59:59.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        userId: 2,
        code: 'SAVE500',
        discountAmount: 500,
        discountType: 'fixed',
        isUsed: false,
        expiresAt: '2025-12-31T23:59:59.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 3,
        userId: 1,
        code: 'SAVE30',
        discountAmount: 30,
        discountType: 'percentage',
        isUsed: true,
        expiresAt: '2025-12-31T23:59:59.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    for (const coupon of coupons) {
      const command = new PutCommand({
        TableName: 'Coupons',
        Item: coupon
      });

      await docClient.send(command);
      console.log(`✅ クーポン ${coupon.code} を作成しました`);
    }

    console.log('🎉 すべてのクーポンデータの作成が完了しました！');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️ Couponsテーブルは既に存在します。データの作成を続行します...');
      
      // テーブルが既に存在する場合は、データの作成のみ実行
      const coupons = [
        {
          id: 1,
          userId: 1,
          code: 'SAVE20',
          discountAmount: 20,
          discountType: 'percentage',
          isUsed: false,
          expiresAt: '2025-12-31T23:59:59.000Z',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          userId: 2,
          code: 'SAVE500',
          discountAmount: 500,
          discountType: 'fixed',
          isUsed: false,
          expiresAt: '2025-12-31T23:59:59.000Z',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 3,
          userId: 1,
          code: 'SAVE30',
          discountAmount: 30,
          discountType: 'percentage',
          isUsed: true,
          expiresAt: '2025-12-31T23:59:59.000Z',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];

      for (const coupon of coupons) {
        const command = new PutCommand({
          TableName: 'Coupons',
          Item: coupon
        });

        await docClient.send(command);
        console.log(`✅ クーポン ${coupon.code} を作成しました`);
      }

      console.log('🎉 すべてのクーポンデータの作成が完了しました！');
    } else {
      console.error('❌ クーポンデータ作成エラー:', error);
    }
  }
};

createCouponsTable(); 