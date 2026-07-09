/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#02020E',
        card: '#02020E',
        primary: '#F5B700',
        ia: '#10B981',
        foreground: '#FFFFFF',
        muted: '#A1A1AA',
        success: '#22C55E',
        warning: '#FB923C',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
};
