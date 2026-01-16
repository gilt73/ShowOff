/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'showoff-bg': '#1a1a2e',
                'showoff-accent': '#e94560',
                'showoff-blue': '#0f3460',
                'showoff-electric': '#00f3ff',
                'option-a-from': '#ff416c', 'option-a-to': '#ff4b2b',
                'option-b-from': '#41295a', 'option-b-to': '#2F0743',
                'option-c-from': '#00b09b', 'option-c-to': '#96c93d',
                'option-d-from': '#f8b500', 'option-d-to': '#fceabb',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pop': 'pop 0.3s ease-out',
                'wiggle': 'wiggle 0.5s ease-in-out infinite',
            },
            keyframes: {
                pop: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            }
        },
    },
    plugins: [],
}
