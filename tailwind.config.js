// todo
//!حذف کن اگه لازمه new
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // صفحات Next.js
    "./pages/**/*.{js,ts,jsx,tsx}", // اگر pages دارید
    "./components/**/*.{js,ts,jsx,tsx}", // کامپوننت‌ها
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
