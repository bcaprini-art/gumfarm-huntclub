/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          900: '#1a2e0a',
          800: '#2d5016',
          700: '#3d6b1e',
          600: '#4d8626',
        },
        tan: {
          100: '#f5e6c8',
          200: '#e8d4a0',
          300: '#d4a853',
          400: '#c49040',
        },
        rust: {
          500: '#c0392b',
          600: '#a93226',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
