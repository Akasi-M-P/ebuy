import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ebuy: {
          bg:           '#0A0A0A',
          'bg-light':   '#111111',
          surface:      '#1A1A1A',
          'surface-2':  '#242424',
          'surface-3':  '#2E2E2E',
          text:         '#F5F5F0',
          muted:        '#9A9A90',
          gold:         'rgb(var(--brand) / <alpha-value>)',
          'gold-light': 'rgb(var(--brand-light) / <alpha-value>)',
          'gold-muted': 'rgb(var(--brand-muted) / <alpha-value>)',
          platinum:     '#E8E8E0',
          success:      '#2ECC71',
          error:        '#E74C3C',
          border:       '#2A2A2A',
          'border-light':'#3A3A3A',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'fade-in':        'fadeIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'slide-up':       'slideUp 0.3s ease-out',
        'scale-in':       'scaleIn 0.2s ease-out',
        'shimmer':        'shimmer 2s linear infinite',
        'spin-slow':      'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        luxury:    '0 4px 24px rgba(0,0,0,0.5)',
        'luxury-lg':'0 8px 40px rgba(0,0,0,0.6)',
        gold:      '0 0 20px rgb(var(--brand) / 0.35)',
        card:      '0 2px 12px rgba(0,0,0,0.4)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gradient-gold':  'linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--brand-light)) 50%, rgb(var(--brand)) 100%)',
        'gradient-dark':  'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
        'shimmer-bg':     'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
      minHeight: {
        cart: '30rem',
      },
    },
  },
  plugins: [],
}

export default config
