#!/bin/bash

echo "🚀 DynamoDB Local初期化スクリプトを開始します..."

# 依存関係を確実にインストール
echo "📦 依存関係をインストール中..."
npm install

# DynamoDB Localの起動を待つ
echo "⏳ DynamoDB Localの起動を待機中..."
until curl -s http://dynamodb-local:8000/shell > /dev/null 2>&1; do
    echo "   DynamoDB Localに接続できません。5秒待機..."
    sleep 5
done

echo "✅ DynamoDB Localに接続できました"

# テーブル作成スクリプトを実行
echo "📊 テーブル作成を開始します..."
cd /app
node scripts/create-dynamodb-table.js

echo "🎉 初期化が完了しました" 