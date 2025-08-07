import { useState, useRef, useEffect } from 'react'
import { uzbekDishes } from '@/moke/data'
import { useTranslation } from 'react-i18next'
import CategorySidebar from '@/components/CatalogSidebar'
import Header from '@/components/Header'

export const categories = [
  {
    id: 'cold_appetizer',
    icon: '🥒',
    name: { uz: 'Gazaklar', ru: 'Холодные закуски', en: 'Cold Appetizers' },
  },
  {
    id: 'salad',
    icon: '🥗',
    name: { uz: 'Salatlar', ru: 'Салаты', en: 'Salads' },
  },
  {
    id: 'first_course',
    icon: '🍲',
    name: { uz: 'Birinchi taomlar', ru: 'Первые блюда', en: 'Soups & First Courses' },
  },
  {
    id: 'second_course',
    icon: '🍛',
    name: { uz: 'Ikkinchi taomlar', ru: 'Вторые блюда', en: 'Main Courses' },
  },
]

export default function UzbekPage() {
  const { i18n, t } = useTranslation()
  const lang = i18n.language
  const [activeCat, setActiveCat] = useState(categories[0].id)
  const [favs, setFavs] = useState([])
  const catRefs = useRef({})

  const changeLang = (l) => i18n.changeLanguage(l)

  const toggleFav = (id) => {
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 180
      for (const c of Object.keys(catRefs.current)) {
        const el = catRefs.current[c]
        if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          setActiveCat(c)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-base font-sans">
      <Header lang={lang} setLang={changeLang} currentPage="uzbek" />

      {/* Mobile tablar */}
      <div className="md:hidden px-4 mt-4 overflow-x-auto no-scrollbar">
        <nav className="flex gap-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCat(c.id)
                catRefs.current[c.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`shrink-0 px-4 py-1 rounded-full font-forum uppercase text-sm tracking-wide 
                ${activeCat === c.id ? 'bg-[#e0d3a3] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {c.name[lang]}
            </button>
          ))}
        </nav>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-6 px-4 gap-6">
        {/* Sidebar (desktop) */}
        <div className="hidden md:block">
          <CategorySidebar
            categories={categories}
            activeCat={activeCat}
            onCategoryClick={(id) => {
              setActiveCat(id)
              catRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            lang={lang}
          />
        </div>

        <main className="flex-1">
          {categories.map((c) => (
            <section
              key={c.id}
              ref={(el) => (catRefs.current[c.id] = el)}
              className="mb-8 scroll-mt-24"
            >
              <h2 className="flex items-center font-forum gap-3 text-xl font-semibold mb-4 text-white">
                <span className="text-2xl">{c.icon}</span>
                {c.name[lang]}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                {(uzbekDishes[c.id] || []).map((d) => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-white/10 overflow-hidden transition"
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={d.image}
                        alt={d.name[lang]}
                        className="w-full h-[180px] object-cover"
                      />
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="text-[14px] font-forum tracking-[0.8px] font-medium text-white">
                        {d.name[lang]}
                      </h3>
                      <div className="mt-2 font-forum text-[16px] text-accent">
                        {d?.price?.toLocaleString()} {t('som')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}