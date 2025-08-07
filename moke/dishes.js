// moke/dishes.js yoki data/dishes.js

export const dishes = [
  // O'zbek taomlari
  {
    id: 1,
    category: 'uzbek',
    name: { uz: "Palov", ru: "Плов", en: "Plov" },
    description: { uz: "Guruch, go'sht va sabzavotlardan tayyorlangan milliy taom", ru: "Национальное блюдо из риса, мяса и овощей", en: "National dish made from rice, meat, and vegetables" },
    price: 35000,
    image: '/images/osh.jpg', // Rasmlar yo'lini to'g'rilang
    rating: 4.9,
  },
  {
    id: 2,
    category: 'uzbek',
    name: { uz: "Somsa", ru: "Самса", en: "Samsa" },
    description: { uz: "Go'shtli yoki ko'katli xamirli taom", ru: "Выпечка с мясом или зеленью", en: "Pastry with meat or greens" },
    price: 8000,
    image: '/images/somsa.jpg',
    rating: 4.8,
  },
  {
    id: 3,
    category: 'uzbek',
    name: { uz: "Lag'mon", ru: "Лагман", en: "Lagman" },
    description: { uz: "Cho'zma ugra, go'sht va sabzavotli taom", ru: "Блюдо с лапшой, мясом и овощами", en: "Dish with noodles, meat, and vegetables" },
    price: 30000,
    image: '/images/lagman.jpg',
    rating: 4.7,
  },
  
  // Yevropa taomlari
  {
    id: 4,
    category: 'european',
    name: { uz: "Pizza Margarita", ru: "Пицца Маргарита", en: "Pizza Margherita" },
    description: { uz: "Pomidor, motsarella va rayhonli klassik pizza", ru: "Классическая пицца с помидорами, моцареллой и базиликом", en: "Classic pizza with tomatoes, mozzarella, and basil" },
    price: 60000,
    image: '/images/pizza.jpg',
    rating: 4.6,
  },
  {
    id: 5,
    category: 'european',
    name: { uz: "Sezar salati", ru: "Салат Цезарь", en: "Caesar Salad" },
    description: { uz: "Tovuq go'shti, salat bargi va maxsus sous bilan", ru: "С курицей, листьями салата и специальным соусом", en: "With chicken, lettuce, and special sauce" },
    price: 45000,
    image: '/images/caesar.jpg',
    rating: 4.5,
  },

  // Bar
  {
    id: 6,
    category: 'bar',
    name: { uz: "Moxito", ru: "Мохито", en: "Mojito" },
    description: { uz: "Yalpiz va laymli salqin ichimlik", ru: "Прохладительный напиток с мятой и лаймом", en: "Cool drink with mint and lime" },
    price: 25000,
    image: '/images/mojito.jpg',
    rating: 4.8,
  }
];

// Top taomlarni shu yerdan avtomatik tanlash mumkin
export const topDishes = dishes.filter(d => [1, 4, 6].includes(d.id));