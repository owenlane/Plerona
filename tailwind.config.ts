import type { Config } from 'tailwindcss';

/**
 * Plerona Design Tokens — Tailwind expression.
 * Governed by The Plerona Website Constitution, Part IV.
 * Mirrors styles/tokens.css and lib/design-tokens.json exactly.
 *
 * LEGACY ALIASES: the pre-V2 class vocabulary (ink/surface/offwhite/blue/
 * silver/graymid/rule) is remapped onto constitutional token values so every
 * existing page and protected checkout component inherits the V2 visual
 * language with zero logic changes. Every value below traces to a token or an
 * opacity-only variant of one (Part IV, Article 1.2).
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Canonical tokens (Part IV, Article 2) ──
        beam: {
          DEFAULT: '#E8C670',
          hover: '#DDB558', // pressed/hover derivations of --color-beam
          active: '#D1A544',
          wash: 'rgba(232,198,112,0.10)',
        },
        space: '#0B0F1A',
        panel: '#1A1F2E',
        snow: '#F5F7FA', // --color-text-primary
        mist: '#A8B0C0', // --color-text-secondary
        success: '#4ADE80',
        error: '#F87171',

        // ── Legacy aliases → constitutional values ──
        ink: '#0B0F1A', // was near-black text/bg → space-deep
        surface: '#1A1F2E', // was white page surface → panel
        offwhite: '#1A1F2E', // was off-white band → panel
        silver: '#A8B0C0', // → text-secondary
        graymid: '#A8B0C0', // → text-secondary (two text tokens only)
        rule: 'rgba(245,247,250,0.14)', // hairlines from text-primary
        blue: {
          DEFAULT: '#E8C670', // interactive highlight → the Beam
          hover: '#DDB558',
          active: '#D1A544',
          wash: 'rgba(232,198,112,0.10)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1080px',
      },
      spacing: {
        // 8px-base constitutional scale exposed as sp-1..sp-12
        'sp-1': '4px',
        'sp-2': '8px',
        'sp-3': '12px',
        'sp-4': '16px',
        'sp-5': '24px',
        'sp-6': '32px',
        'sp-7': '40px',
        'sp-8': '48px',
        'sp-9': '56px',
        'sp-10': '64px',
        'sp-11': '80px',
        'sp-12': '96px',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      letterSpacing: {
        eyebrow: '0.18em',
        tightish: '-0.02em',
        tighter2: '-0.03em',
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '600ms',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.23, 1, 0.32, 1)',
        out: 'cubic-bezier(0.23, 1, 0.32, 1)', // legacy alias → canonical easing
      },
      boxShadow: {
        panel: 'var(--elevation-panel)',
        'panel-focused': 'var(--elevation-panel-focused)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
