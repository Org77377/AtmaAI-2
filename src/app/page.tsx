
// This file (src/app/page.tsx) is no longer the primary entry for the home page.
// The home page content has been moved to src/app/[locale]/page.tsx
// and is handled by the middleware for locale-based routing.

// You can leave this file empty, or add a redirect component if necessary,
// but the middleware should handle redirecting from "/" to "/[defaultLocale]".

// For clarity, an empty component:
export default function DeprecatedHomePage() {
  return null; 
}

// It's also safe to delete this file if your middleware correctly handles
// all root path requests and redirects them to a localized path like /en.
// Next.js App Router will use src/app/[locale]/page.tsx for the actual content.
