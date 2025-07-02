import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">泰鵬支店</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              本格的な味わいと心のこもったサービスで、お客様に最高のラーメン体験をお届けします。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">営業時間</h3>
            <div className="text-gray-300 space-y-1">
              <p>月曜日 - 金曜日: 11:00 - 22:00</p>
              <p>土曜日 - 日曜日: 11:00 - 23:00</p>
              <p>定休日: 火曜日</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
            <div className="text-gray-300 space-y-1">
              <p>電話: 03-1234-5678</p>
              <p>住所: 東京都渋谷区○○○</p>
              <p>メール: info@taiho-ramen.com</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p>&copy; 2024 泰鵬支店. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 