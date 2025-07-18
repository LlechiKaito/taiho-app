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

# 5. prismaディレクトリをコピー
echo "📋 Prismaファイルをコピーしています..."
cp -r prisma lambda-package/

# 6. lambda-packageディレクトリに移動
cd lambda-package

# 7. 本番用依存関係のインストール
echo "📦 本番用依存関係をインストールしています..."
npm ci --only=production

# 8. 環境変数を設定してPrismaクライアント生成
echo "🔧 Prismaクライアントを生成しています..."
export DATABASE_URL=${DATABASE_URL:-"mysql://placeholder:placeholder@localhost:3306/placeholder"}
npx prisma generate

# 9. lambda-packageディレクトリのnode_modulesを確認
echo "📋 Prismaクライアントファイルを確認しています..."
if [ -d "node_modules/.prisma/client" ]; then
    echo "✅ Prismaクライアントが正常に生成されました"
else
    echo "❌ Prismaクライアントの生成に失敗しました"
    exit 1
fi

# 10. zipファイル作成
echo "🗜️  zipファイルを作成しています..."
zip -r ../taiho-lambda.zip . -x "*.git*" "*.DS_Store*" "tests/*" "*.test.*"

# 11. 元のディレクトリに戻る
cd ..

echo "✅ Lambda用パッケージが作成されました: taiho-lambda.zip"
echo "📊 ファイルサイズ: $(du -h taiho-lambda.zip | cut -f1)" 