// Tailwind CSS v4 runs as a single PostCSS plugin (no tailwind.config.js needed;
// design tokens live in app/globals.css under @theme).
const config = {
  plugins: { '@tailwindcss/postcss': {} },
};

export default config;
