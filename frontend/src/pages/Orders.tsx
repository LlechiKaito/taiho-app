import { useState, useEffect } from 'react'
import { orderApi, Order } from '@/services/api'

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderApi.getAll()
      setOrders(response.data.orders || [])
    } catch (err) {
      console.error('注文の取得に失敗しました:', err)
      setError('注文の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { id: 'all', name: 'すべて', color: 'bg-gray-100 text-gray-800' },
    { id: 'pending', name: '待機中', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'cooking', name: '調理中', color: 'bg-blue-100 text-blue-800' },
    { id: 'ready', name: '準備完了', color: 'bg-green-100 text-green-800' },
    { id: 'completed', name: '完了', color: 'bg-gray-100 text-gray-800' }
  ]

  const getOrderStatus = (order: Order) => {
    if (order.isComplete) return 'completed'
    if (order.isCooked && order.isPayment) return 'ready'
    if (order.isCooked && !order.isPayment) return 'cooking'
    return 'pending'
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.id === status)
    return statusOption?.color || 'bg-gray-100 text-gray-800'
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => getOrderStatus(order) === selectedStatus)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            onClick={fetchOrders}
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
        <h1 className="text-4xl font-bold text-center mb-8">注文一覧</h1>
        
        {/* ステータスフィルター */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {statusOptions.map(status => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedStatus === status.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {status.name}
              </button>
            ))}
          </div>
        </div>

        {/* 注文一覧 */}
        <div className="space-y-4">
          {filteredOrders.map((order: Order) => {
            const status = getOrderStatus(order)
            return (
              <div key={order.id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">注文 #{order.id}</h3>
                      <p className="text-sm text-gray-600">ユーザーID: {order.userId}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {statusOptions.find(option => option.id === status)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">注文内容</p>
                      <p className="font-medium">{order.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">注文日時</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">調理済み</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.isCooked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.isCooked ? '完了' : '未完了'}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">支払い</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.isPayment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.isPayment ? '完了' : '未完了'}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">テイクアウト</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.isTakeOut ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.isTakeOut ? 'テイクアウト' : '店内'}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">完了</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.isComplete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.isComplete ? '完了' : '未完了'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">このステータスの注文はありません。</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders 