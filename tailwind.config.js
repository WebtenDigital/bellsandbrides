/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        walsheim: ["GT Walsheim", "DM Sans", "sans-serif"],
        dmsans: ["DM Sans", 'serif'],
        stolzl: ["Stolzl Book", 'serif'],
        sora: ["Sora", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        peach: {
          DEFAULT: "#F95344"
        }
      }
    },
  },
  plugins: [],
}
