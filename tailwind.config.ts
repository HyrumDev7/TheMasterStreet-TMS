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
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#FF0000',
        success: '#00FF00',
        error: '#FF0000',
        'text-primary': '#1A1A1A',
        'text-secondary': '#666666',
        background: '#F5F5F5',
      },
    },
  },
  plugins: [],
}
export default config
