#!/bin/bash

echo "🏗️  Lambda用ビルドを開始します..."

# 1. TypeScriptビルド
echo "📝 TypeScriptをコンパイルしています..."
npm run build

# 2. lambda-packageディレクトリの準備
echo "📦 パッケージディレクトリを準備しています..."
rm -rf lambda-package
mkdir lambda-package

# 3. ビルドファイルをコピー
echo "📋 ビルドファイルをコピーしています..."
cp -r dist/* lambda-package/

# 4. package.jsonとpackage-lock.jsonをコピー
echo "📋 依存関係ファイルをコピーしています..."
cp package.json lambda-package/
cp package-lock.json lambda-package/

# 5. ソースファイルをコピー（DynamoDB用）
echo "📋 ソースファイルをコピーしています..."
cp -r src lambda-package/

# 6. lambda-packageディレクトリに移動
cd lambda-package

# 7. 本番用依存関係のインストール
echo "📦 本番用依存関係をインストールしています..."
npm ci --only=production

# 8. AWS SDKの依存関係を確認
echo "🔧 AWS SDKの依存関係を確認しています..."
if [ -d "node_modules/@aws-sdk" ]; then
    echo "✅ AWS SDKが正常にインストールされました"
else
    echo "❌ AWS SDKのインストールに失敗しました"
    exit 1
fi

# 9. DynamoDB関連ファイルの確認
echo "📋 DynamoDB関連ファイルを確認しています..."
if [ -f "dist/infrastructure/repositories/DynamoDBMenuItemRepository.js" ]; then
    echo "✅ DynamoDBリポジトリが正常にビルドされました"
else
    echo "❌ DynamoDBリポジトリのビルドに失敗しました"
    exit 1
fi

# 10. zipファイル作成
echo "🗜️  zipファイルを作成しています..."
zip -r ../taiho-lambda.zip . -x "*.git*" "*.DS_Store*" "tests/*" "*.test.*" "src/**/*.ts" "tsconfig.json"

# 11. 元のディレクトリに戻る
cd ..

echo "✅ Lambda用パッケージが作成されました: taiho-lambda.zip"
echo "📊 ファイルサイズ: $(du -h taiho-lambda.zip | cut -f1)"
echo "📦 パッケージ内容:"
echo "   - ビルド済みJavaScriptファイル"
echo "   - AWS SDK for JavaScript"
echo "   - DynamoDB関連ファイル"
echo "   - 依存関係ファイル" 