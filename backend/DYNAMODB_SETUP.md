# DynamoDB設定手順

このアプリケーションは、データベースとしてAWS DynamoDBを使用します。以下の手順に従って設定を行ってください。

## 1. 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```env
# DynamoDB設定
AWS_REGION=ap-northeast-1
DYNAMODB_TABLE_NAME=menu-items

# データベース接続先の指定
# ローカル開発環境の場合（DynamoDB Local）
# DYNAMODB_ENDPOINT=http://localhost:8000

# 本番環境では以下を設定
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# CORS設定
CORS_ORIGIN=http://localhost:3000

# サーバー設定
PORT=8080
```

## 2. データベース接続先の設定

### パターン1: ローカルDynamoDB (DynamoDB Local)
```env
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_REGION=ap-northeast-1
```

### パターン2: AWS DynamoDB (本番環境)
```env
# DYNAMODB_ENDPOINT は設定しない（AWSのデフォルトエンドポイント）
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### パターン3: AWS DynamoDB (Lambda環境)
```env
# DYNAMODB_ENDPOINT は設定しない
AWS_REGION=ap-northeast-1
# 認証情報はIAMロールで自動設定
```

## 3. AWS認証情報の設定

### ローカル開発環境の場合

以下のいずれかの方法で認証情報を設定してください：

#### 方法1: AWS CLIを使用
```bash
aws configure
```

#### 方法2: 環境変数を使用
```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=ap-northeast-1
```

### 本番環境（Lambda）の場合

AWS Lambda実行ロールに以下の権限を付与してください：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-1:*:table/menu-items",
                "arn:aws:dynamodb:ap-northeast-1:*:table/menu-items/index/*"
            ]
        }
    ]
}
```

## 4. DynamoDBテーブルの作成

```bash
npm run dynamodb:create-table
```

このスクリプトは以下を行います：

1. `menu-items`テーブルを作成
2. `category-index`（GSI）を作成
3. サンプルデータを挿入

## 5. テーブル構造

### メインテーブル: `menu-items`
- **プライマリキー**: `id` (String)
- **属性**:
  - `id`: メニューアイテムID
  - `name`: メニュー名
  - `description`: 説明（optional）
  - `price`: 価格（Number）
  - `category`: カテゴリ
  - `imageUrl`: 画像URL（optional）
  - `isAvailable`: 利用可能フラグ
  - `createdAt`: 作成日時
  - `updatedAt`: 更新日時

### Global Secondary Index: `category-index`
- **パーティションキー**: `category` (String)
- **ソートキー**: `createdAt` (String)
- **プロジェクション**: ALL

## 6. 使用方法

### 依存関係のインストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### Lambda用パッケージの作成
```bash
npm run package
```

## 7. トラブルシューティング

### よくある問題

1. **認証エラー**: AWS認証情報が正しく設定されているか確認
2. **テーブルが見つからない**: テーブルが作成されているか確認
3. **リージョンエラー**: AWS_REGIONが正しく設定されているか確認

### デバッグ方法

環境変数の確認：
```bash
echo $AWS_REGION
echo $DYNAMODB_TABLE_NAME
```

## 8. 注意事項

- DynamoDBはPay-per-requestモードを使用
- 本番環境では適切なAWSアクセス権限を設定してください
- テーブル削除時は十分注意してください 