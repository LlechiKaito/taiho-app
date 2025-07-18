#!/bin/bash

echo "🚀 Docker環境の初期化を開始します..."

# DynamoDB Localが起動するまで待機
echo "⏳ DynamoDB Localの起動を待機中..."
while ! curl -s http://localhost:8000 > /dev/null; do
  sleep 1
done

echo "✅ DynamoDB Localが起動しました"

# バックエンドディレクトリに移動
cd backend

# DynamoDBテーブルを作成
echo "📊 DynamoDBテーブルを作成中..."
npm run dynamodb:create-table

echo "✅ Docker環境の初期化が完了しました！"
echo ""
echo "🌐 アプリケーションにアクセス："
echo "  - フロントエンド: http://localhost:3000"
echo "  - バックエンド: http://localhost:8080"
echo "  - DynamoDB Local: http://localhost:8000" 