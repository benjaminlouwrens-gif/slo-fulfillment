import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NOTE: exact brand colors from the live slocalfulfillment.com site were not
        // directly inspectable in this session (no visual/DevTools access to the
        // live page). This is a plausible SoCal-logistics palette (navy = trust/
        // infrastructure, orange = shipping/action) chosen to match the site's
        // direct, benefits-driven tone. Check against a live screenshot later.
        primary: {
          50: '#eef3f8',
          100: '#dce7f1',
          200: '#b3c9e0',
          300: '#8aabce',
          400: '#4d7cad',
          500: '#1e3a5f',
          600: '#182e4c',
          700: '#122339',
          800: '#0c1726',
          900: '#060c13',
        },
        secondary: {
          50: '#fafaf8',
          100: '#f5f4f0',
          200: '#ebe9e1',
          300: '#e0ddd1',
          400: '#d5d1c1',
        },
        accent: {
          orange: '#e07a2c',
          orangeDark: '#c4611a',
          slate: '#64748b',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideUp: 'slideUp 0.8s ease-out',
        slideInLeft: 'slideInLeft 0.8s ease-out',
        slideInRight: 'slideInRight 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
