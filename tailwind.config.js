module.exports = {
    purge: { enabled: process.env.NODE_ENV === "production", content: ["./build/**/*.html"] },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [require("@tailwindcss/forms")],
};
