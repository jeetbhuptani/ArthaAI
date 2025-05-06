wind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            table: {
              width: '100%',
              marginTop: '1em',
              marginBottom: '1em',
              borderCollapse: 'collapse',
            },
            'thead th': {
              backgroundColor: 'rgba(236, 253, 245, 0.6)',
            },
            'td, th': {
              padding: '0.5rem',
              borderWidth: '1px',
              borderColor: '#e5e7eb',
            },
          },
        },
        dark: {
          css: {
            'thead th': {
              backgroundColor: 'rgba(6, 78, 59, 0.3)',
            },
            'td, th': {
              borderColor: '#374151',
            },
          },
        },
      },
    },
  },
  plugins: [],
}