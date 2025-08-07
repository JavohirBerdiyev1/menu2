/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        forum: ['"Forum"', 'serif'],
        oswald: ['"Oswald"','serif' ],
        dm: ['"DM Sans"', 'serif'],
      },
      backgroundImage: {
        'menu-pattern': "url('/images/bg-menu.png')",
      },
      colors: {
        base: '#252f3a',
        // , #273546
        card: '#324A5F',
        accent: '#FFA726',
        'accent-alt': '#3DD5B0',
        'text-muted': '#CBD5E1',
        'text-subtle': '#BAC8DB',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        elev: 'var(--shadow-elev)',
      },
    },
  },
  plugins: [],
};