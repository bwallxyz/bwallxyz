/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
    'text-gray-50',
    'text-gray-100',
    'text-gray-200',
    'text-gray-300',
    'text-gray-400',
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-gray-800',
    'text-gray-900',
    'bg-indigo-50',
    'bg-indigo-100',
    'bg-indigo-200',
    'bg-indigo-300',
    'bg-indigo-400',
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-indigo-700',
    'bg-indigo-800',
    'bg-indigo-900',
    'text-indigo-50',
    'text-indigo-100',
    'text-indigo-200',
    'text-indigo-300',
    'text-indigo-400',
    'text-indigo-500',
    'text-indigo-600',
    'text-indigo-700',
    'text-indigo-800',
    'text-indigo-900',
    'bg-green-50',
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900',
    'text-green-50',
    'text-green-100',
    'text-green-200',
    'text-green-300',
    'text-green-400',
    'text-green-500',
    'text-green-600',
    'text-green-700',
    'text-green-800',
    'text-green-900',
    'bg-red-50',
    'bg-red-100',
    'bg-red-200',
    'bg-red-300',
    'bg-red-400',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
    'bg-red-800',
    'bg-red-900',
    'text-red-50',
    'text-red-100',
    'text-red-200',
    'text-red-300',
    'text-red-400',
    'text-red-500',
    'text-red-600',
    'text-red-700',
    'text-red-800',
    'text-red-900',
    'bg-yellow-50',
    'bg-yellow-100',
    'bg-yellow-200',
    'bg-yellow-300',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-yellow-700',
    'bg-yellow-800',
    'bg-yellow-900',
    'text-yellow-50',
    'text-yellow-100',
    'text-yellow-200',
    'text-yellow-300',
    'text-yellow-400',
    'text-yellow-500',
    'text-yellow-600',
    'text-yellow-700',
    'text-yellow-800',
    'text-yellow-900',
    'bg-emerald-50',
    'bg-emerald-100',
    'bg-emerald-200',
    'bg-emerald-300',
    'bg-emerald-400',
    'bg-emerald-500',
    'bg-emerald-600',
    'bg-emerald-700',
    'bg-emerald-800',
    'bg-emerald-900',
    'text-emerald-50',
    'text-emerald-100',
    'text-emerald-200',
    'text-emerald-300',
    'text-emerald-400',
    'text-emerald-500',
    'text-emerald-600',
    'text-emerald-700',
    'text-emerald-800',
    'text-emerald-900',
  ],
};