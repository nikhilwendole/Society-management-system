/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161B22",       // near-black text
        surface: "#F7F8FA",   // page background
        panel: "#FFFFFF",     // card background
        border: "#E5E7EB",
        primary: {
          DEFAULT: "#1E4B43", // deep pine green (society/civic feel)
          light: "#2E6E61",
          dark: "#123028",
        },
        accent: "#C77D3D",     // warm clay accent for CTAs/alerts
        success: "#2E7D5B",
        warning: "#B8862B",
        danger: "#B84A3C",
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        md: "10px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};
