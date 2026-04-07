import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#F4F4E8',
                    100: '#E8E8D5',
                    200: '#D8E6D1',
                    300: '#C5C5B0',
                    400: '#B8CBB0',
                    500: '#85BB65',
                    600: '#4A7C44',
                    700: '#2D5A27',
                    800: '#1A3415',
                    900: '#0D1A12',
                },
            },
            animation: {
                blob: "blob 7s infinite",
            },
            keyframes: {
                blob: {
                "0%": { transform: "translate(0px, 0px) scale(1)" },
                "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
            },
        },
    },

    plugins: [forms],
};
