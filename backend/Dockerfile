FROM node:18-alpine

# OpenSSLをインストール
RUN apk add --no-cache openssl

WORKDIR /app

# 環境変数を設定
ENV DATABASE_URL="postgresql://taiho_user:taiho_password@postgres:5432/taiho_ramen?schema=public"

COPY package*.json ./

RUN npm install

COPY . .

# Prismaクライアントを生成
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"] 