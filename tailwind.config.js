/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        cart: "30rem", // Example minimum height for cart container
      },
    },
  },
  plugins: [],
};
