import axios from 'axios'

// APIのベースURLを環境変数から取得
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const APP_MODE = import.meta.env.MODE || 'development'

// 環境情報をログ出力
console.log(`🌍 Environment: ${APP_MODE}`)
console.log(`🔗 API Base URL: ${API_BASE_URL}`)

// Axiosインスタンスの作成
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error)
    return Promise.reject(error)
  }
)

// メニューアイテムの型定義
export interface MenuItem {
  id: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  price: number;
  category: string;
}

export interface MenuItemListResponse {
  items: MenuItem[];
  total: number;
}

// 注文の型定義
export interface Order {
  id: number;
  userId: number;
  isCooked: boolean;
  isPayment: boolean;
  isTakeOut: boolean;
  createdAt: string;
  description: string;
  isComplete: boolean;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

// メニューアイテム関連のAPI
export const menuApi = {
  // 全メニューアイテム取得
  getAll: () => apiClient.get<MenuItemListResponse>('/api/items'),
}

// 注文関連のAPI
export const orderApi = {
  // 全注文取得
  getAll: () => apiClient.get<OrderListResponse>('/api/orders'),
}

export default apiClient 