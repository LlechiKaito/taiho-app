import React from 'react'

const About: React.FC = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">泰鵬支店について</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 店舗紹介 */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">泰鵬支店について</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                泰鵬支店は、2010年に創業以来、本格的なラーメンの味をお客様にお届けしてきました。
                代々受け継がれてきた秘伝のスープと、こだわりの麺を使用し、心のこもったサービスを心がけています。
              </p>
              <p>
                私たちは、お客様一人ひとりに最高のラーメン体験を提供することを使命とし、
                日々技術の向上とサービスの改善に努めています。
              </p>
              <p>
                新鮮な食材を厳選し、安全で美味しい料理を提供することで、
                お客様の健康と満足を第一に考えています。
              </p>
            </div>
          </div>

          {/* 営業情報 */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">営業情報</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">営業時間</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>月曜日 - 金曜日: 11:00 - 22:00</p>
                    <p>土曜日 - 日曜日: 11:00 - 23:00</p>
                    <p>定休日: 火曜日</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">住所</h3>
                  <p className="text-gray-600">
                    〒150-0002<br />
                    東京都渋谷区○○○ ○-○-○
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">アクセス</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>渋谷駅から徒歩5分</p>
                    <p>原宿駅から徒歩10分</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">お問い合わせ</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>電話: 03-1234-5678</p>
                    <p>メール: info@taiho-ramen.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* こだわり */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">私たちのこだわり</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">伝統の味</h3>
              <p className="text-gray-600">
                創業以来受け継がれてきた秘伝のレシピと、職人の技を活かした本格的な味わい
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">新鮮な食材</h3>
              <p className="text-gray-600">
                毎日厳選された新鮮な食材を使用し、安全で美味しい料理を提供
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">心のこもったサービス</h3>
              <p className="text-gray-600">
                お客様一人ひとりに寄り添い、最高の体験をお届けすることを心がけています
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 