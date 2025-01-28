/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: "#218380",
        bone: "#D5D0C3",
        night: "#161619",
        persian: "#B83C3B",
        tangerine: "#F5A58C"
      },
      fontFamily: {
        serif: ['Nepomuk', 'serif'],
        nepomuk: ['Nepomuk'],
      },
    },
  },
  plugins: [],
}
