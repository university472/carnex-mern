// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {}
//   },
//   plugins: []
// }

// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem'
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px'
      }
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          primary: '#DC2626',
          primaryHover: '#B91C1C',
          secondary: '#111827',
          accent: '#F59E0B',
          success: '#10B981',
          bg: '#F9FAFB',
          surface: '#FFFFFF',
          text: '#111827',
          muted: '#6B7280',
          border: '#E5E7EB'
        }
      },
      boxShadow: {
        card: '0 8px 24px rgba(15,23,42,0.12)',
        cardStrong: '0 16px 40px rgba(15,23,42,0.18)',
        header: '0 4px 16px rgba(15,23,42,0.12)'
      },
      borderRadius: {
        card: '0.75rem'
      },
      transitionTimingFunction: {
        'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)'
      },
      screens: {
        xs: '375px' // iPhone SE width
      }
    }
  },
  plugins: []
}
