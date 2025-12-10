/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f2f8fc',
                    100: '#e1eff8',
                    200: '#c5e0f0',
                    300: '#9cc9e6',
                    400: '#6caed9',
                    500: '#4892cc',
                    600: '#3476af', // Primary brand color (Professional Blue)
                    700: '#2a5e8e',
                    800: '#254f75',
                    900: '#224261',
                },
                accent: {
                    500: '#eab308', // Gold/Yellow for engineering/construction feel
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                arabic: ['Cairo', 'sans-serif'], // For Arabic support
            }
        },
    },
    plugins: [],
}
