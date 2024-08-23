/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#1565d8',
        customSkyBlue: '#60c6fc',
        customSecondary: '#0d2436',
        customPrimary: '#183b56',
        lightPink: '#f4e9fa',
        lightPurple: '#7b67a9',
        mediumPurple: '#6840c2',
        darkPurple: '#412f76',
        hotPink: '#e844bf',
        customGray: '#666e83',
      },
      keyframes: {
        customPulse: {
          '0%, 100%': { backgroundColor: '#e0e0e0' },
          '50%': { backgroundColor: '#c0c0c0' },
        },
      },
      animation: {
        customPulse: 'customPulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#bd93f9',
          'secondary': '#ff79c6',
          'accent': '#50fa7b',
          'neutral': '#44475a',
          'base-100': '#282a36',
          'info': '#8be9fd',
          'success': '#50fa7b',
          'warning': '#ffb86c',
          'error': '#ff5555',
          'foreground': '#f8f8f2',
          'comment': '#6272a4',
        },
      },
      // Other themes can be added here
    ],
  },
}
