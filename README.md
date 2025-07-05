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
- **PostgreSQL** データベース + **Prisma** ORM

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
- PostgreSQL
- Prisma
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
- PostgreSQL 15

## セットアップ

### 前提条件
- Docker
- Docker Compose（または Docker Desktop）

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd taiho-app
```

### 2. Docker Composeで起動
```bash
# 開発環境で起動
docker compose up --build

# バックグラウンドで起動
docker compose up -d --build
```

### 3. データベースの初期化
```bash
# バックエンドコンテナでPrismaのセットアップを実行
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma db push
docker compose exec backend npx prisma db seed
```

### アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8080
- データベース: localhost:5432

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
```bash
# バックエンド（ポート8080）
cd backend
npm install
npm run dev

# フロントエンド（ポート3000）
cd frontend
npm install
npm run dev
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

### Prismaコマンド
```bash
# スキーマからクライアント生成
docker compose exec backend npx prisma generate

# データベースにスキーマを適用
docker compose exec backend npx prisma db push

# シードデータ投入
docker compose exec backend npx prisma db seed

# データベースリセット
docker compose exec backend npx prisma db push --force-reset

# Prisma Studio起動
docker compose exec backend npx prisma studio
```

## 環境変数

### バックエンド
- `PORT` - サーバーポート（デフォルト: 8080）
- `DATABASE_URL` - データベース接続URL

### Docker Compose環境変数
```env
# PostgreSQL設定
POSTGRES_USER=taiho_user
POSTGRES_PASSWORD=taiho_password
POSTGRES_DB=taiho_ramen
DATABASE_URL=postgresql://taiho_user:taiho_password@postgres:5432/taiho_ramen?schema=public
```

## トラブルシューティング

### よくある問題
1. **Prismaクライアントエラー**: `npx prisma generate` を実行
2. **データベース接続エラー**: Docker Composeでpostgresコンテナが起動しているか確認
3. **ポート競合**: 他のアプリケーションが3000または8080ポートを使用していないか確認

### ログ確認
```bash
# 全サービスのログ
docker compose logs

# 特定サービスのログ
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# リアルタイムログ
docker compose logs -f backend
```

## ライセンス

MIT License

## お問い合わせ

ご質問やご意見がございましたら、お気軽にお問い合わせください。 