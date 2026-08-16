/**
 * Without this file Next.js never runs Tailwind at all: the @tailwind
 * directives in globals.css are stripped and every utility class in the app
 * resolves to nothing.
 *
 * That was the state of this project from its first commit — which is why the
 * original components set every colour, size and layout value through inline
 * style={{}} objects. They were working around a build that silently dropped
 * their class names.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
