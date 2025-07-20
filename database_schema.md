# データベース設計図

## テーブル構成

### Users（ユーザー）
| カラム名 | データ型 | 説明 |
|----------|----------|------|
| id | int | ユーザーID（主キー） |
| name | string | ユーザー名 |
| email | string | メールアドレス |
| password | string | パスワード |
| address | string | 住所 |
| telephoneNumber | string | 電話番号 |
| gender | string | 性別 |
| isAdamin | string | マスター権限かどうか |
| createdAt | date | 作成日時 |
| updatedAt | date | 更新日時 |

### Items（商品）（テーブルには、含めない）
| カラム名 | データ型 | 説明 |
|----------|----------|------|
| id | int | 商品ID（主キー） |
| name | string | 商品名 |
| photoUrl | string | 商品画像URL |
| description | string | 商品説明 |
| price | money | 価格 |

### Orders（注文）
| カラム名 | データ型 | 説明 |
|----------|----------|------|
| id | int | 注文ID（主キー） |
| userId | int | ユーザーID（外部キー） |
| isCooked | bool | 調理済みフラグ |
| isPayment | bool | 支払い済みフラグ |
| isTakeOut | bool | テイクアウトフラグ |
| createdAt | int | 作成日時 |
| description | string | 注文詳細 |
| isComplete | bool | 完了フラグ |

### OrderLists（注文明細）
| カラム名 | データ型 | 説明 |
|----------|----------|------|
| id | int | 明細ID（主キー） |
| orderId | int | 注文ID（外部キー） |
| itemId | int | 商品ID（外部キー） |

### Chats（チャット）
| カラム名 | データ型 | 説明 |
|----------|----------|------|
| id | int | チャットID（主キー） |
| orderId | int | 注文ID（外部キー） |
| content | string | チャット内容 |

### Events（イベント）
| カラム名 | データ型 | 説明 |
|----------|----------|------|
| id | int | イベントID（主キー） |
| photoUrl | string | イベント画像URL |

### Carenders（カレンダー）
| カラム名 | データ型 | 説明 |
|----------|----------|------|
| id | int | イベントID（主キー） |
| photoUrl | string | イベント画像URL |
| timestamp | int | いつのカレンダーか |

## リレーション

```
Users (1) ----< Orders (多)
Orders (1) ----< OrderLists (多)
Items (1) ----< OrderLists (多)
Orders (1) ----< Chats (多)
Events (独立したマスタテーブル)
Carenders (独立したマスタテーブル)
```
