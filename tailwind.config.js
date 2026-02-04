/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                electric: '#007BFF',
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
