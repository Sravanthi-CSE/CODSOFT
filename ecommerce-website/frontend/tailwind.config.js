/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#4da6ff',
          500: '#4da6ff',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        secondary: '#6dd5ed',
        accent: {
          50: '#fff8f0',
          100: '#ffe4d1',
          200: '#ffd0a3',
          300: '#ffbc75',
          400: '#ffa84d',
          500: '#ff9f43',
          600: '#ff8c42',
          700: '#ff7333',
          800: '#ff5a1f',
          900: '#ff4c0a',
        },
        danger: {
          50: '#fff5f5',
          100: '#ffe0e0',
          500: '#ff6b6b',
          600: '#ff5252',
          700: '#ff4040',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
        navbar: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
