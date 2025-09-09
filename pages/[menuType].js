import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import Header from '@/components/Header'
import CategorySidebar from '@/components/CatalogSidebar'

// Utility to convert keys like "first_course" to label
function keyToLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function DynamicMenuPage() {
  const router = useRouter()
  const { i18n, t } = useTranslation()
  const lang = i18n.language
  const { menuType } = router.query

  const [data, setData] = useState({})
  const [activeCat, setActiveCat] = useState('')
  const catRefs = useRef({})

  useEffect(() => {
    if (!menuType) return
    fetch(`/api/menu?menuType=${menuType}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json || {})
        const firstKey = Object.keys(json || {})[0] || ''
        setActiveCat(firstKey)
      })
      .catch(() => {
        setData({})
        setActiveCat('')
      })
  }, [menuType])

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

  const categories = useMemo(() => {
    return Object.keys(data || {}).map((id) => ({
      id,
      icon: '•',
      name: { uz: keyToLabel(id), ru: keyToLabel(id), en: keyToLabel(id) },
    }))
  }, [data])

  const changeLang = (l) => i18n.changeLanguage(l)

  return (
    <div className="min-h-screen bg-base font-sans">
      <Header lang={lang} setLang={changeLang} currentPage={String(menuType || '')} />

      {/* Mobile tabs (keep consistent with other pages) */}
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
            <section key={c.id} ref={(el) => (catRefs.current[c.id] = el)} className="mb-8 scroll-mt-24">
              <h2 className="flex items-center font-forum gap-3 text-xl font-semibold mb-4 text-white">
                {c.name[lang]}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                {(data[c.id] || []).map((d) => (
                  <div key={d.id} className="rounded-xl border border-white/10 overflow-hidden transition">
                    <div className="relative">
                      <img src={d.image} alt={typeof d.name === 'object' ? (d.name[lang] || d.name.en) : d.name} className="w-full h-[180px] object-cover" />
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="text-[14px] font-forum tracking-[0.8px] font-medium text-white">
                        {typeof d.name === 'object' ? (d.name[lang] || d.name.en) : d.name}
                      </h3>
                      <div className="mt-2 font-forum text-[16px] text-accent">
                        {d?.price?.toLocaleString?.() || d?.price}
                        {d?.price != null ? ` ${t('som')}` : ''}
                        {d.weight && <span className="text-gray-400 ml-1">• {d.weight}</span>}
                      </div>
                      {d.showDescription && d.description && typeof d.description === 'object' && (d.description[lang] || d.description.en) && (
                        <div className="mt-2 text-xs text-gray-300 line-clamp-2">{d.description[lang] || d.description.en}</div>
                      )}
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


