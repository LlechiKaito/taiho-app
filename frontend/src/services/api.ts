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
export interface MenuItemData {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface MenuItem extends MenuItemData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// メニューアイテム関連のAPI
export const menuApi = {
  // 全メニューアイテム取得
  getAll: () => apiClient.get('/items'),
  
  // メニューアイテム作成
  create: (data: MenuItemData) => apiClient.post('/items', data),
  
  // 以下は将来の拡張用（現在バックエンドで未実装）
  // getById: (id: string) => apiClient.get(`/items/${id}`),
  // getByCategory: (category: string) => apiClient.get(`/items/category/${category}`),
  // update: (id: string, data: MenuItemData) => apiClient.put(`/items/${id}`, data),
  // delete: (id: string) => apiClient.delete(`/items/${id}`),
}

// ヘルスチェック
export const healthApi = {
  check: () => apiClient.get('/health')
}

export default apiClient 