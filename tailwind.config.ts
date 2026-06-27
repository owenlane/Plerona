import type { Config } from 'tailwindcss';

/**
 * Plerona design tokens — derived directly from Website Structure V2 §03.
 * White, black, and blue are the only dominant colors. Silver and gray
 * support hierarchy. No additional brand colors. No gradients.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a', // Primary Dark — near black
        surface: '#ffffff', // Surface White
        offwhite: '#f7f7f7', // Surface Off-White
        blue: {
          DEFAULT: '#1a56db', // Blue Accent — deep blue
          hover: '#1648b8', // darken ~8%
          active: '#123a96', // darken ~16%
          wash: '#f0f5ff', // hosting-card selected fill
        },
        silver: '#c0c4cc',
        graymid: '#888888',
        rule: '#e4e4e4', // Border / Rule
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1080px',
      },
      letterSpacing: {
        eyebrow: '0.18em',
        tightish: '-0.02em',
        tighter2: '-0.03em',
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        pulse2: 'pulse2 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
