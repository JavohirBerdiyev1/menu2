
// pages/index.js
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { MapPin, Phone, Clock, Star, Heart, ShoppingCart, Globe } from 'lucide-react'
import Link from 'next/link'
import { topDishes } from '@/moke/data'


const menuCategories = [
  { id: 'uzbek', name: { uz: "O'zbek taomlari", ru: "Узбекская кухня", en: "Uzbek Cuisine" }, icon: "🇺🇿" },
  { id: 'european', name: { uz: "Yevropa taomlari", ru: "Европейская кухня", en: "European Cuisine" }, icon: "🍝" },
  { id: 'bar', name: { uz: "Bar", ru: "Бар", en: "Bar" }, icon: "🍹" }
]

export default function Home() {
  const { t, i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState('uz')
  const [favorites, setFavorites] = useState([])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setCurrentLang(lng)
  }

  const toggleFavorite = (dishId) => {
    setFavorites(prev => 
      prev.includes(dishId) 
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🍽️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{t('restaurant_name')}</h1>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-600" />
              <select 
                value={currentLang} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="uz">O'zbek</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📋</span>
                Menu
              </h2>
              <nav className="space-y-3">
                {menuCategories.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/${category.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors duration-200 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {category.icon}
                    </span>
                    <span className="font-medium text-gray-700 group-hover:text-red-600">
                      {category.name[currentLang]}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  {t('welcome')} 🎉
                </h2>
                <p className="text-gray-600 text-lg">
                  {currentLang === 'uz' ? 'Eng mazali milliy taomlarni his qiling' : 
                   currentLang === 'ru' ? 'Почувствуйте вкус национальных блюд' : 
                   'Experience the taste of national dishes'}
                </p>
              </div>
            </div>

            {/* Top Dishes Carousel */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                {t('top_dishes')}
              </h2>
              
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active'
                }}
                navigation={true}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 2,
                  },
                }}
                className="pb-12"
              >
                {topDishes.map((dish) => (
                  <SwiperSlide key={dish.id}>
                    <div className="food-card p-6 h-full">
                      <div className="relative mb-4">
                        <img 
                          src={dish.image} 
                          alt={dish.name[currentLang]}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button 
                          onClick={() => toggleFavorite(dish.id)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <Heart 
                            className={`w-5 h-5 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                          />
                        </button>
                        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{dish.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {dish.name[currentLang]}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {dish.description[currentLang]}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-500">
                          {dish.price.toLocaleString()} {t('som')}
                        </span>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
                          <ShoppingCart className="w-4 h-4" />
                          <span>{t('add_to_cart')}</span>
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {currentLang === 'uz' ? 'Tez yetkazib berish' : 
                   currentLang === 'ru' ? 'Быстрая доставка' : 
                   'Fast Delivery'}
                </h3>
                <p className="text-gray-600">
                  {currentLang === 'uz' ? '30 daqiqada yetkazib beramiz' : 
                   currentLang === 'ru' ? 'Доставляем за 30 минут' : 
                   'We deliver in 30 minutes'}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {currentLang === 'uz' ? 'Yuqori sifat' : 
                   currentLang === 'ru' ? 'Высокое качество' : 
                   'High Quality'}
                </h3>
                <p className="text-gray-600">
                  {currentLang === 'uz' ? 'Faqat fresh mahsulotlar' : 
                   currentLang === 'ru' ? 'Только свежие продукты' : 
                   'Only fresh products'}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {currentLang === 'uz' ? 'Sevimli ta\'mlar' : 
                   currentLang === 'ru' ? 'Любимые вкусы' : 
                   'Favorite Tastes'}
                </h3>
                <p className="text-gray-600">
                  {currentLang === 'uz' ? 'Milliy va xalqaro taomlar' : 
                   currentLang === 'ru' ? 'Национальные и международные блюда' : 
                   'National and international dishes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🍽️</span>
                </div>
                <h3 className="text-xl font-bold">{t('restaurant_name')}</h3>
              </div>
              <p className="text-gray-400">
                {currentLang === 'uz' ? 'Eng mazali milliy taomlar' : 
                 currentLang === 'ru' ? 'Самые вкусные национальные блюда' : 
                 'The most delicious national dishes'}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {t('address')}
              </h4>
              <p className="text-gray-400">
                {currentLang === 'uz' ? 'Toshkent sh., Chilonzor tumani, Bunyodkor ko\'chasi 12' : 
                 currentLang === 'ru' ? 'г. Ташкент, Чиланзарский район, ул. Бунёдкор 12' : 
                 'Tashkent, Chilanzar district, Bunyodkor street 12'}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                {t('phone')}
              </h4>
              <p className="text-gray-400">+998 90 123 45 67</p>
              <p className="text-gray-400">+998 71 123 45 67</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 {t('restaurant_name')}. 
              {currentLang === 'uz' ? ' Barcha huquqlar himoyalangan.' : 
               currentLang === 'ru' ? ' Все права защищены.' : 
               ' All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}