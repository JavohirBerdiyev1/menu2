import { useState, useRef, useEffect } from "react";
import { europeanDishes } from "@/moke/data";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import CategorySidebar from "@/components/CatalogSidebar";
import Header from "@/components/Header";

export default function EuropeanPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [activeCat, setActiveCat] = useState("cold_appetizer");
  const [favs, setFavs] = useState([]);
  const catRefs = useRef({});

  const categories = [
    {
      id: "cold_appetizer",
      icon: "🥒",
      name: { uz: "Gazaklar", ru: "Холодные закуски", en: "Cold Appetizers" },
    },
    {
      id: "nuts",
      icon: "🥜",
      name: { uz: "Issiq gazaklar", ru: "Горячие закуски", en: "Hot Appetizers" },
    },
    {
      id: "salad",
      icon: "🥗",
      name: { uz: "Salatlar", ru: "Салаты", en: "Salads" },
    },
    {
      id: "second_course",
      icon: "🍛",
      name: { uz: "Ikkinchi taomlar", ru: "Вторые блюда", en: "Main Courses" },
    },
  ];

  const changeLang = (l) => {
    i18n.changeLanguage(l);
  };

  const toggleFav = (id) => {
    setFavs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-base font-sans">
      <Header lang={lang} setLang={changeLang} currentPage="european" />

      {/* Mobile tab navigation */}
      <div className="md:hidden px-4 mt-4 overflow-x-auto no-scrollbar">
        <nav className="flex gap-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCat(c.id);
                catRefs.current[c.id]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`shrink-0 px-4 py-1 rounded-full font-forum uppercase text-sm tracking-wide 
                ${activeCat === c.id ? "bg-[#e0d3a3] text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {c.name[lang]}
            </button>
          ))}
        </nav>
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-6 px-4 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <CategorySidebar
            categories={categories}
            activeCat={activeCat}
            onCategoryClick={(id) => {
              setActiveCat(id);
              catRefs.current[id]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            lang={lang}
          />
        </div>

        {/* Main content */}
        <main className="flex-1">
          {categories.map((c) => (
            <section
              key={c.id}
              ref={(el) => (catRefs.current[c.id] = el)}
              className="mb-6 scroll-mt-24"
            >
              <h2 className="flex items-center gap-3 text-2xl mb-4 text-white font-forum">
                <span className="text-xl">{c.icon}</span>
                {c.name[lang]}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                {(europeanDishes[c.id] || []).map((d) => {
                  const isFav = favs.includes(d.id);
                  return (
                    <div
                      key={d.id}
                      className="relative rounded-xl border border-white/10 overflow-hidden"
                    >
                      {/* ❤️ Fav button */}
                      <button
                        onClick={() => toggleFav(d.id)}
                        className="absolute top-2 right-2 z-10 text-white hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFav ? "fill-[#e0d3a3] text-[#e0d3a3]" : "text-white/50"
                          }`}
                        />
                      </button>

                      {/* image */}
                      <img
                        src={d.image}
                        alt={d.name[lang]}
                        className="w-full h-[180px] object-cover"
                      />

                      {/* text */}
                      <div className="p-2 text-center">
                        <h3 className="text-[16px] font-forum truncate text-white">
                          {d.name[lang]}
                        </h3>
                        <div className="mt-2 font-forum text-accent">
                          {d?.price?.toLocaleString()} {t("som")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}