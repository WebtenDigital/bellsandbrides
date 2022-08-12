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
      fontSize: {
        rt: '10px'
      },
      colors: {
        peach: {
          DEFAULT: "#F95344"
        }
      },
      borderRadius: {
        '4xl':'36px'
      }
    },
  },
  plugins: [],
}
