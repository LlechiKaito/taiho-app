FROM node:22-alpine

# curlをインストール
RUN apk add --no-cache curl

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# すべての依存関係をインストール（開発用も含む）
RUN npm install

# アプリケーションコードをコピー
COPY . .

# 初期化スクリプトをコピー
COPY docker-init.sh /docker-init.sh
RUN chmod +x /docker-init.sh

# TypeScriptをビルド
RUN npm run build

# ポート8080を公開
EXPOSE 8080

# アプリケーションを起動
CMD ["npm", "start"] 