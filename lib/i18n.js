// lib/i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  uz: {
    translation: {
      "uzbek_food": "O'zbek taomlari",
      "european_food": "Yevropa taomlari",
      "bar": "Bar",
      "top_dishes": "Top taomlar",
      "address": "Manzil",
      "phone": "Telefon",
      "welcome": "Xush kelibsiz",
      "restaurant_name": "Milliy Ta'mlar",
      "soup": "Shurva",
      "main_course": "Asosiy taomlar",
      "dessert": "Shirinliklar",
      "beverages": "Ichimliklar",
      "add_to_cart": "Qo'shish",
      "som": "so'm",
      "tagline": "Mazali taomlar va yoqimli muhit.",
      "need_table": "Stol bron qilmoqchimisiz?",
      "call_now": "Hoziroq qo‘ng‘iroq qiling",
      "book_table": "Stol bron qilish",
      "whatsapp_us": "WhatsAppga yozish",
      "quick_links": "Bo‘limlar",
      "view_menu": "Menyu",
      "shashlik": "Shashlik",
      "bread": "Non",
      "hookah": "Kal’yan",
      "contact": "Aloqa",
      "view_on_map": "Xaritada ko‘rish",
      "hours": "Ish vaqti",
      "hours_value": "10:00 — 23:00",
      "language": "Til",
      "rights_reserved": "Barcha huquqlar himoyalangan.",
      "privacy": "Maxfiylik siyosati",
      "terms": "Foydalanish shartlari",
      "hero_title": "Nargile Restaurant",
      "hero_subtitle": "Mazali taomlar, nafis muhit va unutilmas kechalar.",
      "explore_menu": "Explore Menu",
      "address_short": "123 Tashkent Street"
    }
  },
  ru: {
    translation: {
      "uzbek_food": "Узбекская кухня",
      "european_food": "Европейская кухня",
      "bar": "Бар",
      "top_dishes": "Топ блюда",
      "address": "Адрес",
      "phone": "Телефон",
      "welcome": "Добро пожаловать",
      "restaurant_name": "Национальные блюда",
      "soup": "Суп",
      "main_course": "Основные блюда",
      "dessert": "Десерты",
      "beverages": "Напитки",
      "add_to_cart": "Добавить",
      "som": "som",
      "tagline": "Вкусные блюда и приятная атмосфера.",
      "need_table": "Хотите забронировать стол?",
      "call_now": "Позвонить сейчас",
      "book_table": "Забронировать стол",
      "whatsapp_us": "Написать в WhatsApp",
      "quick_links": "Разделы",
      "view_menu": "Меню",
      "shashlik": "Шашлык",
      "bread": "Хлеб",
      "bar": "Бар",
      "hookah": "Кальян",
      "contact": "Контакты",
      "view_on_map": "Посмотреть на карте",
      "hours": "Время работы",
      "hours_value": "10:00 — 23:00",
      "language": "Язык",
      "rights_reserved": "Все права защищены.",
      "privacy": "Политика конфиденциальности",
      "terms": "Условия использования",
      "hero_title": "Welcome to Nargile Restaurant",
      "hero_subtitle": "Mazali taomlar, nafis muhit va unutilmas kechalar.",
      "explore_menu": "Explore Menu",
      "address_short": "123 Tashkent Street"
    }
  },
  en: {
    translation: {
      "uzbek_food": "Uzbek Cuisine",
      "european_food": "European Cuisine",
      "bar": "Bar",
      "top_dishes": "Top Dishes",
      "address": "Address",
      "phone": "Phone",
      "welcome": "Welcome",
      "restaurant_name": "National Dishes",
      "soup": "Soup",
      "main_course": "Main Course",
      "dessert": "Dessert",
      "beverages": "Beverages",
      "add_to_cart": "Add to Cart",
      "som": "som",
      "restaurant_name": "Restaurant Name",
      "tagline": "Delicious food and a cozy vibe.",
      "need_table": "Want to reserve a table?",
      "call_now": "Call now",
      "book_table": "Book a table",
      "whatsapp_us": "Message on WhatsApp",
      "quick_links": "Sections",
      "view_menu": "Menu",
      "shashlik": "Shashlik",
      "bread": "Bread",
      "hookah": "Hookah",
      "contact": "Contact",
      "view_on_map": "View on map",
      "hours": "Working hours",
      "hours_value": "10:00 — 23:00",
      "language": "Language",
      "rights_reserved": "All rights reserved.",
      "privacy": "Privacy Policy",
      "terms": "Terms of Use",
      "hero_title": "Nargile Restaurant",
      "hero_subtitle": "Mazali taomlar, nafis muhit va unutilmas kechalar.",
      "explore_menu": "Explore Menu",
      "address_short": "123 Tashkent Street"
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',          // server va birinchi renderda har doim 'uz'
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  })

export default i18n