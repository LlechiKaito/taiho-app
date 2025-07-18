# 泰鵬支店 - ホームページ

ラーメン屋のホームページアプリケーションです。Express.js（バックエンド）、React（フロントエンド）、TypeScript、Docker、Tailwind CSSを使用して構築されています。

## アーキテクチャ

### バックエンド
- **Express.js** + **TypeScript**
- **ドメイン駆動設計（DDD）**を採用
  - Domain Layer: エンティティとリポジトリインターフェース
  - Application Layer: アプリケーションサービス
  - Infrastructure Layer: データベース実装
  - Interface Layer: コントローラーとルーティング
- **AWS DynamoDB** データベース + **AWS SDK**

### フロントエンド
- **React** + **TypeScript**
- **Tailwind CSS** でスタイリング
- **React Router** でルーティング
- **Vite** でビルド

## 技術スタック

### バックエンド
- Node.js 22
- Express.js
- TypeScript
- AWS DynamoDB
- AWS SDK for JavaScript
- CORS
- Helmet
- Morgan
- Jest（テスト）

### フロントエンド
- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Vite

### インフラ
- Docker
- Docker Compose
- DynamoDB Local
- DynamoDB Admin

## 環境構築

### 前提条件
- **Docker** (version 20.10以上)
- **Docker Compose** (version 2.0以上)
- **Node.js** (version 18以上) - ローカル開発の場合
- **Git**

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd taiho-app
```

### 2. 環境変数の設定

#### バックエンド環境変数
```bash
# backend/.env ファイルを作成
cd backend
cp .env.example .env  # もし.exampleファイルがある場合
```

`.env`ファイルの内容：
```env
# DynamoDB設定
AWS_REGION=ap-northeast-1
DYNAMODB_TABLE_NAME=menu-items

# ローカル開発環境用
DYNAMODB_ENDPOINT=http://dynamodb-local:8000

# CORS設定
CORS_ORIGIN=http://localhost:3000

# サーバー設定
PORT=8080
```

#### フロントエンド環境変数
```bash
# frontend/.env ファイルを作成
cd frontend
cp .env.example .env  # もし.exampleファイルがある場合
```

`.env`ファイルの内容：
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Docker Composeで起動

#### 初回起動（ビルド付き）
```bash
# 全サービスをビルドして起動
docker compose up --build

# バックグラウンドで起動
docker compose up -d --build
```

#### 2回目以降の起動
```bash
# 通常起動
docker compose up

# バックグラウンドで起動
docker compose up -d
```

### 4. データベースの初期化

#### 自動初期化（推奨）
```bash
# 初期化スクリプトを実行
./docker-init.sh
```

#### 手動初期化
```bash
# DynamoDBテーブルを作成
docker compose exec backend node scripts/create-dynamodb-table.js

# またはnpmスクリプトを使用
docker compose exec backend npm run dynamodb:create-table
```

### 5. 動作確認

#### サービスアクセス
- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8080
- **DynamoDB Admin**: http://localhost:8001
- **DynamoDB Local**: http://localhost:8000

#### ヘルスチェック
```bash
# バックエンドの状態確認
curl http://localhost:8080/health

# メニューAPIの確認
curl http://localhost:8080/api/menu-items
```

### 6. トラブルシューティング

#### よくある問題と解決方法

**1. ポートが既に使用されている**
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :8080
lsof -i :8000
lsof -i :8001

# 必要に応じてプロセスを停止
kill -9 <PID>
```

**2. Dockerコンテナが起動しない**
```bash
# ログを確認
docker compose logs

# コンテナを再作成
docker compose down
docker compose up --build
```

**3. DynamoDBテーブルが作成されない**
```bash
# DynamoDB Localが起動しているか確認
docker compose ps dynamodb-local

# 手動でテーブル作成
docker compose exec backend node scripts/create-dynamodb-table.js
```

**4. フロントエンドでAPIエラーが発生**
```bash
# バックエンドのログを確認
docker compose logs backend

# バックエンドを再起動
docker compose restart backend
```

### 7. 開発環境の詳細設定

#### ホットリロード設定
```bash
# ファイル変更を監視して自動再起動
docker compose up

# 特定のサービスのログを監視
docker compose logs -f backend
docker compose logs -f frontend
```

#### デバッグ設定
```bash
# コンテナ内でデバッグ
docker compose exec backend sh
docker compose exec frontend sh

# ログの詳細確認
docker compose logs --tail=100 backend
```

## 開発

### Docker環境での開発
```bash
# アプリケーション起動
docker compose up

# ログ確認
docker compose logs backend
docker compose logs frontend

# コンテナ再起動
docker compose restart backend
docker compose restart frontend

# 停止
docker compose down
```

### ローカル開発（オプション）

#### 前提条件
- Node.js 18以上
- npm または yarn

#### バックエンド開発
```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env  # 必要に応じて

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test
```

#### フロントエンド開発
```bash
cd frontend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env  # 必要に応じて

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

#### データベース設定（ローカル開発）
```bash
# DynamoDB Localを起動
docker run -p 8000:8000 amazon/dynamodb-local

# テーブル作成
cd backend
node scripts/create-dynamodb-table.js
```

### テスト実行
```bash
# バックエンドのテスト
docker compose exec backend npm test

# テスト監視モード
docker compose exec backend npm run test:watch

# カバレッジ付きテスト
docker compose exec backend npm run test:coverage

# E2Eテスト
docker compose exec backend npm run test:e2e
```

### ビルド
```bash
# Dockerビルド
docker compose build

# 個別ビルド
docker compose build backend
docker compose build frontend
```

## API エンドポイント

### メニューアイテム
- `GET /api/menu-items` - 全メニューアイテム取得
- `GET /api/menu-items/:id` - 特定のメニューアイテム取得
- `GET /api/menu-items/category/:category` - カテゴリ別メニューアイテム取得
- `POST /api/menu-items` - メニューアイテム作成
- `PUT /api/menu-items/:id` - メニューアイテム更新
- `DELETE /api/menu-items/:id` - メニューアイテム削除

### ヘルスチェック
- `GET /health` - サーバー状態確認

## プロジェクト構造

```
taiho-app/
├── backend/                 # バックエンド
│   ├── src/
│   │   ├── domain/         # ドメイン層
│   │   │   ├── entities/   # エンティティ（ビジネスロジック）
│   │   │   └── repositories/ # リポジトリインターフェース
│   │   ├── application/    # アプリケーション層
│   │   │   └── services/   # アプリケーションサービス
│   │   ├── infrastructure/ # インフラストラクチャ層
│   │   │   ├── repositories/ # リポジトリ実装（Prisma）
│   │   │   └── database/   # データベース設定
│   │   ├── interfaces/     # インターフェース層
│   │   │   ├── controllers/ # コントローラー
│   │   │   └── routes/     # ルーティング
│   │   └── index.ts        # エントリーポイント
│   ├── prisma/             # Prismaスキーマとシード
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── tests/              # テストファイル
│   │   ├── unit/           # ユニットテスト
│   │   ├── e2e/            # E2Eテスト
│   │   └── setup.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── Dockerfile
├── frontend/               # フロントエンド
│   ├── src/
│   │   ├── components/     # 共通コンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── services/      # API通信
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## データベース操作

### DynamoDBコマンド
```bash
# DynamoDBテーブルの作成とサンプルデータ投入
docker compose exec backend npm run dynamodb:create-table

# 手動でテーブル作成
docker compose exec backend node scripts/create-dynamodb-table.js

# DynamoDB Admin 管理画面
# http://localhost:8001 にアクセス

# DynamoDB Local Shell
# http://localhost:8000/shell にアクセス
```

### データベース接続情報

#### DynamoDB Local設定
- **エンドポイント**: `http://localhost:8000`
- **リージョン**: `ap-northeast-1`
- **テーブル名**: `menu-items`
- **認証情報**: ローカル環境用ダミー認証

#### 接続確認
```bash
# DynamoDB Localの状態確認
curl http://localhost:8000

# テーブル一覧確認
aws dynamodb list-tables --endpoint-url http://localhost:8000

# テーブル詳細確認
aws dynamodb describe-table --table-name menu-items --endpoint-url http://localhost:8000
```

## 環境変数

### バックエンド環境変数
```env
# サーバー設定
PORT=8080

# DynamoDB設定
AWS_REGION=ap-northeast-1
DYNAMODB_TABLE_NAME=menu-items
DYNAMODB_ENDPOINT=http://dynamodb-local:8000

# AWS認証情報（ローカル環境用）
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy

# CORS設定
CORS_ORIGIN=http://localhost:3000

# ログ設定
NODE_ENV=development
```

### フロントエンド環境変数
```env
# API設定
VITE_API_BASE_URL=http://localhost:8080

# 開発環境設定
VITE_DEV_MODE=true
```

### Docker Compose環境変数
```env
# バックエンド設定
BACKEND_PORT=8080
BACKEND_NODE_ENV=development

# フロントエンド設定
FRONTEND_PORT=3000
FRONTEND_NODE_ENV=development

# DynamoDB Local設定
DYNAMODB_LOCAL_PORT=8000
DYNAMODB_ADMIN_PORT=8001
```

## トラブルシューティング

### よくある問題
1. **DynamoDBテーブルが存在しない**: `docker compose exec backend node scripts/create-dynamodb-table.js` を実行
2. **データベース接続エラー**: Docker Composeでdynamodb-localコンテナが起動しているか確認
3. **ポート競合**: 他のアプリケーションが3000、8080、8000、8001ポートを使用していないか確認
4. **CORSエラー**: フロントエンドとバックエンドのポート設定を確認
5. **環境変数エラー**: `.env`ファイルが正しく設定されているか確認

### ログ確認
```bash
# 全サービスのログ
docker compose logs

# 特定サービスのログ
docker compose logs backend
docker compose logs frontend
docker compose logs dynamodb-local
docker compose logs dynamodb-admin

# リアルタイムログ
docker compose logs -f backend
```

## ライセンス

MIT License

## お問い合わせ

ご質問やご意見がございましたら、お気軽にお問い合わせください。 