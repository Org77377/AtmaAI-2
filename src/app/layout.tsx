
// This file is intentionally left for Next.js to use as the root layout
// before the [locale] segment.
// It should contain minimal structure, or be empty if all layout logic
// has moved to src/app/[locale]/layout.tsx.
// For now, we'll make it a simple pass-through.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// The actual root layout logic (ThemeProvider, fonts, metadata, etc.) 
// is now in src/app/[locale]/layout.tsx
// If you had any global providers or context that are NOT locale-specific
// and must wrap the entire app (even above locale handling), they could go here.
// But for most cases, src/app/[locale]/layout.tsx is the main layout file now.
