import { useState, useEffect } from 'react'
import { menuApi, MenuItem } from '@/services/api'

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await menuApi.getAll()
      // バックエンドは { items: [...] } の形式で返すため
      setMenuItems(response.data.items || [])
    } catch (err) {
      console.error('メニューアイテムの取得に失敗しました:', err)
      setError('メニューの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'ラーメン', name: 'ラーメン' },
    { id: 'ご飯もの', name: 'ご飯もの' },
    { id: 'サイドメニュー', name: 'サイドメニュー' },
    { id: 'ドリンク', name: 'ドリンク' }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  // 画像エラーハンドリング
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    // プレースホルダー画像に変更
    target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image'
  }

  // 画像読み込み状態の管理
  const [imageLoadStatus, setImageLoadStatus] = useState<{[key: string]: boolean}>({})

  const handleImageLoad = (id: string) => {
    setImageLoadStatus(prev => ({ ...prev, [id]: true }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMenuItems}
            className="btn-primary"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">メニュー</h1>
        
        {/* カテゴリフィルター */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* メニューアイテム */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: MenuItem) => (
            <div key={item.id} className="card hover:shadow-lg transition-shadow">
              <div className="relative">
                {item.imageUrl ? (
                  <div className="relative">
                    {/* 画像読み込み中のスケルトン */}
                    {!imageLoadStatus[item.id] && (
                      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg mb-4 flex items-center justify-center">
                        <div className="text-gray-400">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={`w-full h-48 object-cover rounded-t-lg mb-4 transition-opacity ${
                        imageLoadStatus[item.id] ? 'opacity-100' : 'opacity-0 absolute top-0'
                      }`}
                      onLoad={() => handleImageLoad(item.id)}
                      onError={handleImageError}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">画像なし</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-lg font-bold text-primary-600">
                    ¥{typeof item.price === 'number' ? item.price.toLocaleString() : '価格未設定'}
                  </span>
                </div>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  {!item.isAvailable && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      売り切れ
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">このカテゴリのメニューはありません。</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu 