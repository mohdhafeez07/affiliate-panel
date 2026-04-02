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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        cyber: {
          black: '#020617',
          deep: '#030816',
          card: 'rgba(15, 23, 42, 0.6)',
          border: 'rgba(51, 65, 85, 0.5)',
          blue: {
            DEFAULT: '#22d3ee',
            glow: 'rgba(34, 211, 238, 0.4)',
          },
          purple: {
            DEFAULT: '#a855f7',
            glow: 'rgba(168, 85, 247, 0.4)',
          },
          emerald: '#10b981',
          rose: '#f43f5e',
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
            muted: '#64748b',
          }
        },
        dark: {
          bg: '#020617',
          card: '#0f172a',
          border: '#1e293b',
          text: '#f8fafc',
          muted: '#94a3b8',
        }
      },
      backgroundImage: {
        'cyber-gradient': 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)',
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(34, 211, 238, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.15) 0, transparent 50%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'cyber-blue': '0 0 20px -5px rgba(34, 211, 238, 0.3)',
        'cyber-purple': '0 0 20px -5px rgba(168, 85, 247, 0.3)',
        'cyber-inner': 'inset 0 0 15px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 0.8, filter: 'brightness(1)' },
          '50%': { opacity: 1, filter: 'brightness(1.5)' },
        }
      }
    },
  },
  plugins: [],
}
