import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0E0F11',
          raised: '#17181B',
          overlay: '#1F2023'
        },
        border: '#2A2B2F',
        ink: {
          DEFAULT: '#EDEDEC',
          muted: '#8B8D93',
          faint: '#5C5E64'
        },
        signal: {
          alert: '#E5484D',
          gold: '#D4A73D',
          done: '#3FB27F',
          info: '#5B8DEF'
        }
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '10px'
      }
    }
  },
  plugins: []
};

export default config;
