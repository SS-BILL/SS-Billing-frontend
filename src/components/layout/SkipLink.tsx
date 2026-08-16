/**
 * Keyboard shortcut past the navigation.
 *
 * Visually hidden until focused, at which point it becomes a normal visible
 * control. Without it, reaching the dashboard content by keyboard means
 * tabbing through every header link on every page load.
 *
 * Pairs with id="main" on the page's <main> element.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:border focus:border-primary focus:bg-surface-overlay focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-content-primary"
    >
      Skip to main content
    </a>
  );
}
