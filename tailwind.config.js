/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c003e', // Derin mor
          dark: '#10001c',
          light: '#7F00FF', // Sıcak mor
        },
        accent: {
          DEFAULT: '#E64980', // Sıcak pembe
          pink: '#FF00FF',
          gold: '#FFD700', // Altın sarısı
        },
        lavender: '#b57edc', // Yumuşak lavanta
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#a0aec0',
          500: '#718096',
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923',
        },
        background: '#10001c',
        card: '#1e0a2f',
        'text-main': '#f0e6ff',
        'text-muted': '#a093b0',
        'bg-color': 'var(--bg-color)',
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
        'accent-color': 'var(--accent-color)',
        'text-muted-color': 'var(--text-muted-color)',
        'card-bg-color': 'var(--card-bg-color)',
        'highlight-color': 'var(--highlight-color)',
      },
      fontFamily: {
        sans: ['Poppins', 'Lora', 'sans-serif'],
        heading: ['Lora', 'Poppins', 'serif'],
        cinzel: ['Cinzel Decorative', 'serif'],
        cabin: ['Cabin', 'Lora', 'serif'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.625rem',
        lg: '1rem',
        xl: '1.25rem',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(44, 0, 62, 0.15)',
        gold: '0 2px 8px 0 #FFD70055',
      },
    },
  },
  plugins: [],
}; 