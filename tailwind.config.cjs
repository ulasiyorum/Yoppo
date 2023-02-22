/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      brightness: {
        85: '.85',
      },
      backgroundSize: {
        '50y':'50%',
        '100y':'100%',
      },
      
      fontFamily: {
        'nunito-b': ['Nunito-Bold','Nunito'],
        'nunito':['Nunito'],
        'karla':['Karla'],
        'titilium':['Titilium Web'],
      },
      fontSize: {
      '100': '100px',
      '64': '64px',
      '32': '32px',
    }},
  },
  plugins: [],
}
