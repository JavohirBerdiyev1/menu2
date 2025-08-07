import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Header from "@/components/Header";

const categories = [
  {
    id: "uzbek",
    name: { uz: "Milliy taomlar", ru: "Узбекская", en: "Uzbek" },
    image: "/food/qozon1.jpg",
  },
  {
    id: "european",
    name: { uz: "Yevropa taomlar", ru: "Европейская", en: "European" },
    image: "/food/Baby%20Mozzarello..jpg",
  },
  {
    id: "shashlik",
    name: { uz: "Shashlik", ru: "Шашлык", en: "Shashlik" },
    image: "/shashlik-hero.jpg",
  },
  {
    id: "bread",
    name: { uz: "Non", ru: "Хлеб", en: "Bread" },
    image: "/non.jpg",
  },
  {
    id: "bar",
    name: { uz: "Bar", ru: "Бар", en: "Bar" },
    image: "/food/hero.jpg",
  },
  {
    id: "hookah",
    name: { uz: "Kal'yan", ru: "Кальян", en: "Hookah" },
    image: "/hookah.jpg",
  },
];

export default function IndexPage() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "ru");

  const changeLang = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
  };
  return (
    <div className="min-h-screen bg-base font-sans text-white">
      <Header lang={lang} setLang={changeLang} currentPage="home" />

   <section className="relative h-[200px] md:h-[300px]">

  {/* background */}
  <img
    src="/restaurant-table.jpg"
    alt="Restaurant"
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)] mix-blend-overlay" />

  {/* content */}
  <div className="relative z-10 h-full flex items-center">
    <div className="mx-auto max-w-6xl px-4 text-center">
      <h1 className="text-balance font-oswald text-[40px] md:text-6xl tracking-wide mb-4">
        {t('hero_title') || ' Nargile Restaurant'}
      </h1>
      {/* <p className="mx-auto max-w-2xl text-white/80 text-base md:text-lg mb-8">
        {t('hero_subtitle') || 'Mazali taomlar, nafis muhit va unutilmas kechalar.'}
      </p> */}

   

      {/* badges */}
      {/* <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80">
          ⏰ {t('hours_value') || '10:00 — 23:00'}
        </span>
        <a
          href="https://maps.google.com/?q=123+Tashkent+Street"
          target="_blank"
          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
        >
          📍 {t('address_short') || '123 Tashkent Street'}
        </a>
      </div> */}
    </div>
  </div>
</section>

      <section
        id="menu"
        className="max-w-6xl mx-auto px-10 py-12 grid gap-6 md:grid-cols-2"
      >
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${c.id}`}
            className="relative h-48 rounded-xl overflow-hidden shadow-card group"
          >
            <img
              src={c.image}
              alt={c.name[lang]}
              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <h3 className="relative z-10 flex items-end justify-center h-full pb-4 font-forum text-2xl">
              {c.name[lang]}
            </h3>
          </Link>
        ))}
      </section>

      {/* <footer className="relative mt-16">
        <div className="relative bg-base text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />

          <div className="relative max-w-6xl mx-auto px-4 py-4 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <img src="/logo.png" alt="Logo" className="w-36 h-auto rounded-full" />
              <p className="font-forum text-2xl tracking-wide">
                {t("restaurant_name") || "Restaurant Name"}
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {t("tagline") || "Mazali taomlar va yoqimli muhit."}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://t.me/"
                  target="_blank"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  aria-label="Telegram"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9.28 15.57 8.97 20a1 1 0 0 0 1.58.85l2.67-1.86 3.84 2.79a1 1 0 0 0 1.56-.62l3.32-15.49a1 1 0 0 0-1.37-1.13L2.64 9.54a1 1 0 0 0 .06 1.87l5.72 2.1 10.52-8.22-9.66 10.28z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M16.5 7.5h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  aria-label="Facebook"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">
                {t("quick_links") || "Bo‘limlar"}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/uzbek"
                    className="hover:text-[#e0d3a3] transition"
                  >
                    {t("uzbek_food") || "Milliy taomlar"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/european"
                    className="hover:text-[#e0d3a3] transition"
                  >
                    {t("european_food") || "Yevropa taomlar"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shashlik"
                    className="hover:text-[#e0d3a3] transition"
                  >
                    {t("shashlik") || "Shashlik"}
                  </Link>
                </li>
                <li>
                  <Link href="/bar" className="hover:text-[#e0d3a3] transition">
                    {t("bar") || "Bar"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hookah"
                    className="hover:text-[#e0d3a3] transition"
                  >
                    {t("hookah") || "Kal’yan"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">
                {t("contact") || "Aloqa"}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="text-white/80">
                  <span className="block text-white/60">
                    {t("address") || "Manzil"}
                  </span>
                  <span>123 Tashkent Street</span>
                </li>
                <li>
                  <a
                    href="tel:+998901234567"
                    className="hover:text-[#e0d3a3] transition"
                  >
                    {t("phone") || "Telefon"}: +998 90 123 45 67
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=123+Tashkent+Street"
                    target="_blank"
                    className="inline-flex items-center gap-2 hover:text-[#e0d3a3] transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    {t("view_on_map") || "Xaritada ko‘rish"}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">
                {t("hours") || "Ish vaqti"}
              </h4>
              <p className="text-sm">10:00 — 23:00</p>

              <div className="mt-6">
                <h5 className="text-sm font-semibold mb-3">
                  {t("language") || "Til"}
                </h5>
                <div className="flex items-center gap-2">
                  {["uz", "ru", "en"].map((lng) => (
                    <button
                      key={lng}
                      onClick={() => changeLang(lng)}
                      className={`px-3 py-2 rounded-lg text-sm transition
                  ${
                    lang === lng
                      ? "bg-white text-black"
                      : "bg-white/10 hover:bg-white/20"
                  }
                `}
                    >
                      {lng.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10" />
          <div className="max-w-6xl mx-auto px-4 py-6 text-xs flex flex-col md:flex-row items-center gap-3 md:gap-6 justify-between text-white/60">
            <p>
              © {new Date().getFullYear()}{" "}
              {t("restaurant_name") || "Restaurant Name"}.{" "}
              {t("rights_reserved") || "Barcha huquqlar himoyalangan."}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition">
                {t("privacy") || "Maxfiylik siyosati"}
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/terms" className="hover:text-white transition">
                {t("terms") || "Foydalanish shartlari"}
              </Link>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
