
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const sparklesSVGDataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9.937 15.5A2 2 0 0 0 8.5 14.063 2 2 0 0 0 7.062 15.5a2 2 0 0 0 1.438 1.437 2 2 0 0 0 1.437-1.437Z' /%3E%3Cpath d='M8.5 19.5A2 2 0 0 0 7.063 18.063a2 2 0 0 0-1.438 1.437A2 2 0 0 0 7.062 21a2 2 0 0 0 1.438-1.5Z' /%3E%3Cpath d='M19.5 15.5a2 2 0 0 0-1.438-1.438A2 2 0 0 0 16.624 15.5a2 2 0 0 0 1.438 1.437A2 2 0 0 0 19.5 15.5Z' /%3E%3Cpath d='m14 3-1.5 1.5L11 3l-1.5 1.5L8 3l-1.5 1.5L5 3' /%3E%3Cpath d='m19 8-1.5 1.5L16 8l-1.5 1.5L13 8l-1.5 1.5L10 8' /%3E%3Cpath d='M22 12.5a2.5 2.5 0 0 0-4.084-1.952 2.5 2.5 0 0 0-4.083 1.952A2.5 2.5 0 0 0 12.5 15a2.5 2.5 0 0 0 1.234 2.148 2.5 2.5 0 0 0 4.083-1.952A2.5 2.5 0 0 0 19.25 13a2.5 2.5 0 0 0 .759-.148A2.5 2.5 0 0 0 22 12.5Z' /%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: 'AatmAI - your AI therapist',
  description: 'AatmAI, your AI therapist: A personal guide for career, finance, and relationships.',
  icons: {
    icon: sparklesSVGDataUri,
    apple: sparklesSVGDataUri,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
