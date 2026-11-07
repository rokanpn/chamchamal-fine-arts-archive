import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Gallery Palette (Dynamic CSS Variables for Theme Switcher)
        obsidian: {
          DEFAULT: 'rgb(var(--obsidian-base) / <alpha-value>)',
          base: 'rgb(var(--obsidian-base) / <alpha-value>)',
          surface: 'rgb(var(--obsidian-surface) / <alpha-value>)',
          elevated: 'rgb(var(--obsidian-elevated) / <alpha-value>)',
          overlay: 'var(--obsidian-overlay)',
          glass: 'var(--obsidian-glass)',
        },
        parchment: {
          DEFAULT: 'rgb(var(--parchment-base) / <alpha-value>)',
          pure: 'rgb(var(--parchment-pure) / <alpha-value>)',
          subtle: 'rgb(var(--parchment-subtle) / <alpha-value>)',
          muted: 'rgb(var(--parchment-muted) / <alpha-value>)',
        },
        gold: {
          DEFAULT: '#D4AF37', // Fine Art Gold accent
          light: '#E8C860',
          dark: '#A68520',
          shimmer: '#FFF2B2',
          glow: 'rgba(212, 175, 55, 0.25)',
          subtle: 'rgba(212, 175, 55, 0.12)',
        },
        museum: {
          secondary: 'rgb(var(--museum-secondary) / <alpha-value>)',
          caption: 'rgb(var(--museum-caption) / <alpha-value>)',
          border: 'var(--museum-border)',
          'border-hover': 'var(--museum-border-hover)',
          'border-gold': 'rgba(212, 175, 55, 0.3)',
          divider: 'var(--museum-divider)',
        },
      },
      fontFamily: {
        // Bi-directional Typography Stack
        kurdish: ['var(--font-vazirmatn)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-vazirmatn)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Cinzel', 'Georgia', 'serif'],
        display: ['var(--font-cinzel)', 'var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      height: {
        screen: '100dvh', // Modern dynamic viewport height for mobile PWA
      },
      minHeight: {
        screen: '100dvh',
      },
      maxHeight: {
        screen: '100dvh',
      },
      boxShadow: {
        'glass-nav': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-pill': '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 50px rgba(212, 175, 55, 0.3)',
        'art-card': '0 20px 50px -10px rgba(0, 0, 0, 0.7)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'inner-gold': 'inset 0 1px 1px 0 rgba(212, 175, 55, 0.3)',
      },
      keyframes: {
        // Smooth ambient pulsing glow for gallery lighting & accent seals
        'ambient-pulse': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'scale(1)',
            filter: 'blur(40px)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(1.08)',
            filter: 'blur(48px)',
          },
        },
        // Subtle gold border breathing glow
        'gold-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.18)',
            borderColor: 'rgba(212, 175, 55, 0.25)',
          },
          '50%': {
            boxShadow: '0 0 28px rgba(212, 175, 55, 0.4)',
            borderColor: 'rgba(212, 175, 55, 0.55)',
          },
        },
        // Shimmer sheen sweeping across fine art cards and metallic badges
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        // Weightless levitation for 3D scan indicators and museum artifacts
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        // Subtle atmospheric rotation for background geometric mandala
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'ambient-pulse': 'ambient-pulse 8s ease-in-out infinite',
        'gold-pulse': 'gold-pulse 4s ease-in-out infinite',
        shimmer: 'shimmer 2.8s infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '32px',
        '3xl': '48px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFF2B2 0%, #D4AF37 50%, #A68520 100%)',
        'gold-subtle': 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.03) 100%)',
        'obsidian-radial': 'radial-gradient(circle at 50% 0%, #17171C 0%, #0A0A0C 75%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
