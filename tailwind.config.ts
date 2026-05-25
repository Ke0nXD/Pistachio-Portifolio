import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pistachio-green': '#B9FF8A',
        'pistachio-green-strong': '#8BE75A',
        'pistachio-purple': '#C04BEA',
        'pistachio-purple-dark': '#7A2BA8',
        'pistachio-yellow': '#FFF4A8',
        'pistachio-cream': '#FFFBEF',
        'pistachio-pink': '#F8B8DD',
        'ink': '#211827',
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        'cute': '1.5rem',
        'cuter': '2rem',
      },
      boxShadow: {
        'cute': '0 4px 24px rgba(122, 43, 168, 0.18)',
        'cute-lg': '0 8px 40px rgba(122, 43, 168, 0.25)',
        'green': '0 4px 24px rgba(185, 255, 138, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'tail-wag': 'tailWag 1s ease-in-out infinite',
        'blink': 'blink 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        tailWag: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
