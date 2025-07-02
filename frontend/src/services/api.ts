import axios from 'axios'

// APIのベースURLを環境変数から取得
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api'

// Axiosインスタンスの作成
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_BASE_PATH}`,
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

// メニューアイテム関連のAPI
export const menuApi = {
  // 全メニューアイテム取得
  getAll: () => apiClient.get('/menu-items'),
  
  // 特定のメニューアイテム取得
  getById: (id: string) => apiClient.get(`/menu-items/${id}`),
  
  // カテゴリ別メニューアイテム取得
  getByCategory: (category: string) => apiClient.get(`/menu-items/category/${category}`),
  
  // メニューアイテム作成
  create: (data: any) => apiClient.post('/menu-items', data),
  
  // メニューアイテム更新
  update: (id: string, data: any) => apiClient.put(`/menu-items/${id}`, data),
  
  // メニューアイテム削除
  delete: (id: string) => apiClient.delete(`/menu-items/${id}`),
}

// ヘルスチェック
export const healthApi = {
  check: () => apiClient.get('/health', { baseURL: API_BASE_URL })
}

export default apiClient 