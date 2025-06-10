import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Swiss design spacing system - 8px grid
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
        '54': '13.5rem',  // 216px
        '58': '14.5rem',  // 232px
        '62': '15.5rem',  // 248px
      },
      // Swiss minimal color palette
      colors: {
        // Pure Swiss minimal colors
        white: '#FFFFFF',
        black: '#111111',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Professional blue for primary actions
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#0078D4',
          600: '#006BB3',
          700: '#005A94',
        },
        // Status colors
        green: {
          500: '#10B981',
          600: '#059669',
        },
        red: {
          500: '#EF4444',
          600: '#DC2626',
        },
        yellow: {
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      // Swiss typography scale
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'sm': ['0.875rem', { lineHeight: '1.5rem' }],   // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px - base
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '3rem' }],        // 48px
        '6xl': ['3.75rem', { lineHeight: '3.75rem' }],  // 60px
      },
      // Swiss-style border radius
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      // Minimal box shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'none': 'none',
      },
      // Swiss animation principles - subtle and fast
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Swiss grid system
      gridTemplateColumns: {
        'sidebar': '240px 1fr',
        'main': '1fr 320px',
        'kanban': 'repeat(auto-fit, minmax(280px, 1fr))',
      },
    },
  },
  plugins: [],
};
export default config;
