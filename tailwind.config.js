import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        secondary: "#ffffff",
        focus: 'var(--focus)',
        'primary-100': 'var(--primary-100)',
        'primary-200': 'var(--primary-200)',
        'primary-300': 'var(--primary-300)',
        'primary-400': 'var(--primary-400)',
        'primary-500': 'var(--primary-500)',
        'primary-600': 'var(--primary-600)',
        'primary-700': 'var(--primary-700)',
        'primary-800': 'var(--primary-800)',
        'primary-900': 'var(--primary-900)',
        'primary-DEFAULT': 'var(--primary-DEFAULT)',
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {   //the color values must be the same of the ./scr/app/styles/variables.scss
      "modern": {
        extend: "dark",
        colors: {
          background: "#18181c",
          foreground: "#ffffff",
          focus: "#0070f4",
          secondary: "#ffffff",
          primary: {
            50: "#fceff2",
            100: "#d8d8dd",
            200: "#bfbfc1",
            300: "#a5a5a7",
            400: "#8b8b8c",
            500: "#727273",
            600: "#58585a",
            700: "#3f3f41",
            800: "#26262a",
            900: "#16090d",
            DEFAULT: "#a5a5a7"
          },
        }
      }
    }
  })],
}
