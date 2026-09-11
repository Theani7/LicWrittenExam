/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#fef2f3',
          100: '#fde2e4',
          200: '#fcc9cd',
          500: '#e01a3c',
          600: '#c8102e', // Official Nepal Crimson (Rhododendron)
          700: '#a50d26',
          800: '#870e22',
          900: '#701121',
          950: '#40040e',
        },
        navy: {
          50: '#eff5ff',
          100: '#dbe7fe',
          200: '#bfd5fe',
          500: '#1d55b0',
          600: '#0f4499',
          700: '#003893', // Official Nepal Flag Border Blue
          800: '#062c70',
          900: '#0c2656',
          950: '#061226',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
