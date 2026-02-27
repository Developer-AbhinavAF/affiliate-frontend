/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'light-bg-primary': '#E8E2D8',
        'light-bg-secondary': '#F9F8F6',
        'light-bg-card': '#E9E3DF',
        'light-bg-hero': '#E6E6E6',
        'light-bg-hover': '#EEE',
        'light-text-primary': '#2B2A2A',
        'light-text-secondary': '#2B2A2A80',
        // Dark mode colors
        'dark-bg-primary': '#1a1a1b',
        'dark-bg-secondary': '#27272a',
        'dark-bg-card': '#2d2d2d',
        'dark-text-primary': '#e8e8e8',
        'dark-text-secondary': '#a1a1a1',
      },
    },
  },
  plugins: [],
}
