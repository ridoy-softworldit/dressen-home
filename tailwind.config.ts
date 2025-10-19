/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Minimal Premium Fashion Color Palette
        primary: {
          DEFAULT: '#1E1E1E', // Deep Charcoal Black
          50: '#F6F5F3',
          100: '#EEEBE7',
          200: '#DDD7CF',
          300: '#CCC3B7',
          400: '#BBAF9F',
          500: '#AA9B87',
          600: '#99876F',
          700: '#887357',
          800: '#775F3F',
          900: '#1E1E1E', // Main charcoal
        },
        secondary: {
          DEFAULT: '#F6F5F3', // Soft Warm White
          50: '#FFFFFF',
          100: '#FEFEFE',
          200: '#FCFCFC',
          300: '#FAFAFA',
          400: '#F8F8F8',
          500: '#F6F5F3', // Main soft warm white
          600: '#F4F3F1',
          700: '#F2F1EF',
          800: '#F0EFED',
          900: '#EEEDED',
        },
        accent: {
          DEFAULT: '#D2B48C', // Muted Beige / Sand
          50: '#F9F6F2',
          100: '#F3EDE5',
          200: '#E7DBCB',
          300: '#DBC9B1',
          400: '#CFB797',
          500: '#D2B48C', // Main muted beige
          600: '#C5A373',
          700: '#B8925A',
          800: '#AB8141',
          900: '#9E7028',
        },
        neutral: {
          DEFAULT: '#E4E4E4', // Neutral Gray
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E4E4E4', // Main neutral
          400: '#DADADA',
          500: '#D0D0D0',
          600: '#C6C6C6',
          700: '#BCBCBC',
          800: '#B2B2B2',
          900: '#A8A8A8',
        },
        highlight: {
          DEFAULT: '#6B705C', // Deep Olive / Stone
          50: '#F4F5F3',
          100: '#E9EBE7',
          200: '#D3D7CF',
          300: '#BDC3B7',
          400: '#A7AF9F',
          500: '#919B87',
          600: '#7B876F',
          700: '#6B705C', // Main deep olive
          800: '#5A5E4E',
          900: '#494C40',
        },
      },
    },
  },
  plugins: [],
};
