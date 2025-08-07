import { useState, useRef, useEffect } from 'react';
import { shashlikItems } from '@/moke/data';
import { useTranslation } from 'react-i18next';
import CategorySidebar from '@/components/CatalogSidebar';
import Header from '@/components/Header';

/* Faqat bitta bo‘lim */
const categories = [
  {
    id: 'shashlik',
    icon: '🍢',
    name: { uz: 'Shashlik', ru: 'Шашлык', en: 'Shashlik' },
  },
];

const getText = (field, lang) =>
  typeof field === 'string'
    ? field
    : field?.[lang] || field?.en || Object.values(field || {})[0] || '';

export default function ShashlikPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [activeCat, setActiveCat] = useState('shashlik');
  const catRefs = useRef({});

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 180;
      for (const c of Object.keys(catRefs.current)) {
        const el = catRefs.current[c];
        if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          setActiveCat(c);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-base font-sans">
      <Header lang={lang} setLang={i18n.changeLanguage} currentPage="shashlik" />

      {/* Mobile tab bar */}
      <div className="md:hidden px-4 mt-4 overflow-x-auto no-scrollbar">
        <nav className="flex gap-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCat(c.id);
                catRefs.current[c.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`shrink-0 px-4 py-1 rounded-full font-forum uppercase text-sm tracking-wide 
                ${activeCat === c.id ? "bg-[#e0d3a3] text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {c.name[lang]}
            </button>
          ))}
        </nav>
      </div>

      {/* Page layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-6 px-4 gap-6">
        {/* Sidebar (desktop) */}
        <div className="hidden md:block">
          <CategorySidebar
            categories={categories}
            activeCat={activeCat}
            onCategoryClick={(id) => {
              setActiveCat(id);
              catRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            lang={lang}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 w-full mt-2">
          {/* Hero */}
          <div className="relative h-[25vh] md:h-[40vh] w-full mb-8">
            <img src="/shashlik-hero.jpg" alt="Grill" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black opacity-50" />
          </div>

          {/* Section */}
          <section
            ref={(el) => (catRefs.current.shashlik = el)}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="flex items-center gap-3 text-xl font-semibold mb-6 text-white">
              <span className="text-2xl">🍢</span>
              {categories[0].name[lang]}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              {shashlikItems.shashlik.map((d) => (
                <div key={d.id} className="flex flex-col">
                  <div className="flex items-baseline mb-1 text-[#E0E0E0]">
                    <h3 className="text-sm tracking-wider uppercase whitespace-nowrap">
                      {getText(d.name, lang)}
                    </h3>
                    <div className="flex-grow h-px border-b-2 border-double border-[#a37e2c] mx-4" />
                    <p className="text-sm whitespace-nowrap">
                      {d.price.toLocaleString()} {t('som')}
                    </p>
                  </div>
                
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}