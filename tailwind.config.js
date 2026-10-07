/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rezonx: {
          bg: "#060b18",
          text: "#ffffff",
          primary: "#6366f1",
          secondary: "#22d3ee",
          accent: "#c084fc",
        }
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(34, 211, 238, 0.1)',
        'glow-lg': '0 0 60px rgba(34, 211, 238, 0.15)',
      },
    },
  },
  plugins: [],
}
