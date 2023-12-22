import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        wiggle: {
          '0%, 50%, 100%': { transform: 'rotate(-2deg)' },
          '25%, 75%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
