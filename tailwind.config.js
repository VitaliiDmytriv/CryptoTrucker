/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode based on class
  theme: {
    extend: {},
    screens: {
      xs: "360px", // дуже маленькі телефони
      sm: "480px", // телефони у портреті
      md: "640px", // великі телефони / маленькі планшети
      lg: "768px", // планшети
      xl: "1024px", // десктоп
      "2xl": "1280px", //
    },
  },
  plugins: [],
};
