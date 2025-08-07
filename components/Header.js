import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";

const menuCategories = [
  { id: "uzbek",    name: { uz: "Milliy taomlar",  ru: "Узбекская",   en: "Uzbek"    } },
  { id: "european", name: { uz: "Yevropa taomlar", ru: "Европейская", en: "European" } },
  { id: "businessLunch", name: { uz: "Biznes-lanch", ru: "Бизнес-ланч", en: "Business Lunch" } },
  { id: "shashlik", name: { uz: "Shashlik",        ru: "Шашлык",      en: "Shashlik" } },
  { id: "garnish", name: { uz: "Garnirlar", ru: "Гарниры", en: "Garnishes" } },
  { id: "bread",    name: { uz: "Non",             ru: "Хлеб",        en: "Bread"    } },
  { id: "bar",      name: { uz: "Bar",             ru: "Бар",         en: "Bar"      } },
  { id: "hookah",   name: { uz: "Kal'yan",         ru: "Кальян",      en: "Hookah"   } },
];

export default function Header({ lang, setLang, currentPage }) {
  const { i18n } = useTranslation();
  const gold = "text-[#e0d3a3]"; // oltin rang
  const grayLine = "bg-white/10"; // chiziq rangi

  const [open, setOpen] = useState(false);

  const change = (v) => {
    setLang(v);
    i18n.changeLanguage(v);
    setOpen(false);
  };
  return (
    <header className="sticky top-[-1px] z-50 bg-transparent">
      <div className={`h-px w-full ${grayLine}`} />
      <div className="flex items-center justify-between px-4 md:px-10 gap-4 py-4 bg-base shadow-elev relative">
        <button
          className="md:hidden text-white"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

                {/* Logo only on mobile and centered */}
        <div className="absolute left-1/2  -translate-x-1/2 md:hidden">
          <Link href="/" className="flex flex-row gap-2 items-center">
          <img src="/logo-2.png" alt="Logo" className="h-10" />
            <span className="text-white text-lg font-forum tracking-wide hover:text-[#e0d3a3]">
              Nargile
            </span>
            
          </Link>
        </div>



        <nav
          className={`${
            open ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row gap-4 md:gap-9 absolute md:static top-full left-0 w-full md:w-auto bg-base md:bg-transparent p-4 md:p-0 shadow-elev md:shadow-none`}
        >
          {menuCategories.map((m, idx) => (
           <div key={m.id} className="relative flex items-center">
           <Link
             href={`/${m.id}`}
             className={`relative font-forum text-white uppercase tracking-wide text-sm 
               ${
                 m.id === currentPage
                   ? gold
                   : "text-white hover:text-[#e0d3a3]"
               }
               after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full
               ${
                 m.id === currentPage
                   ? "after:bg-[#e0d3a3]"
                   : "after:bg-transparent"
               }
             `}
           >
             {m.name[lang]}
           </Link>
       
           {/* Oradagi rombchani absolute qilib joylashtirdik */}
           {idx < menuCategories.length - 1 && (
             <span className="absolute right-[10px] md:right-[-20px] top-1/2 -translate-y-1/2 w-2 h-2 border border-[#e0d3a3] rotate-45 pointer-events-none" />
           )}
         </div>
          ))}
        </nav>
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Globe className={`${gold} w-4 h-4`} />
          <select
            value={lang}
            onChange={(e) => change(e.target.value)}
            className={`appearance-none bg-transparent font-forum uppercase ${gold} outline-none`}
          >
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
      <div className={`h-px w-full ${grayLine}`} />
    </header>
  );
}
