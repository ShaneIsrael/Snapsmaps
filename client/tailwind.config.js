const { heroui } = require('@heroui/react')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        vibes: 'GreatVibes',
        lobster: 'Lobster',
        lobsterTwo: 'LobsterTwo',
        lobsterTwoBold: 'LobsterTwoBold',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: '#020617',
          },
        },
      },
    }),
  ],
}
