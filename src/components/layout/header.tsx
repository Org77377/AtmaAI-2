
"use client";

import Link from 'next/link';
import { Sparkles, LogOut, Menu, Bookmark, Globe } from 'lucide-react'; // Added Globe
import { MainNav, type NavItemType } from '@/components/layout/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation'; // usePathname
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/language-switcher'; // Import LanguageSwitcher
import type { Locale } from '@/lib/i18n-config';

interface HeaderProps {
  dictionary: { // Dictionary for header strings
    home: string;
    chat: string;
    stories: string;
    about_us: string;
    saved_quotes: string;
    tagline: string;
    peace_out_reset: string;
    // Add keys for language switcher if it has text directly in header, or pass full switcher dict
    change_language?: string; 
    english?: string;
    hindi?: string;
    kannada?: string;
  };
  locale: Locale; // Current locale
}

export default function Header({ dictionary, locale }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName');
      toast({
        title: "See Ya!",
        description: "You've been logged out. Enter a new name to start fresh.",
      });
      setIsMobileMenuOpen(false);
      window.location.href = `/${locale}`; // Redirect to localized home
    }
  };
  
  // Prepare nav items with translations
  const translatedNavItems: NavItemType[] = [
    { href: `/${locale}`, label: dictionary.home },
    { href: `/guidance`, label: dictionary.chat }, // Stays non-localized for now
    { href: `/stories`, label: dictionary.stories }, // Stays non-localized for now
    { href: `/about`, label: dictionary.about_us },   // Stays non-localized for now
  ];

  const allNavItemsForMobile: NavItemType[] = [
    ...translatedNavItems,
    { href: `/quotes/saved`, label: dictionary.saved_quotes, icon: <Bookmark className="mr-2 h-4 w-4" /> } // Stays non-localized for now
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href={`/${locale}`} className="mr-4 md:mr-8 flex items-baseline space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <span className="font-bold text-lg">AatmAI</span>
            <span className="ml-1.5 text-xs text-muted-foreground">{dictionary.tagline}</span>
          </div>
        </Link>

        <div className="hidden md:flex md:flex-grow">
         <MainNav navItems={translatedNavItems} currentLocale={locale} />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-1 md:hidden">
          <LanguageSwitcher dictionary={{
            change_language: dictionary.change_language || "Change Language",
            english: dictionary.english || "English",
            hindi: dictionary.hindi || "Hindi",
            kannada: dictionary.kannada || "Kannada"
          }} />
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle>
                  <Link href={`/${locale}`} className="flex items-baseline space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Sparkles className="h-6 w-6 text-primary" />
                     <div>
                        <span className="font-bold text-lg">AatmAI</span>
                        <span className="ml-1.5 text-xs text-muted-foreground">{dictionary.tagline}</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-1 p-4">
                {allNavItemsForMobile.map((item) => (
                  <SheetClose asChild key={item.href}>
                     <Link
                       href={item.href} // These links are already correctly formed or non-localized
                       className={cn(
                         "block px-3 py-2 rounded-md text-base font-medium",
                         pathname === item.href || pathname === `/${locale}${item.href === '/' ? '' : item.href}` ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                       )}
                       onClick={() => setIsMobileMenuOpen(false)}
                     >
                       {item.icon ? <span className="inline-block align-middle mr-2">{item.icon}</span> : null}
                       {item.label}
                     </Link>
                  </SheetClose>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="p-4 space-y-4">
                <SheetClose asChild>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                        <LogOut className="mr-1.5 h-4 w-4" />
                        {dictionary.peace_out_reset}
                    </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="hidden md:flex items-center justify-end space-x-1 sm:space-x-2 ml-auto">
          <LanguageSwitcher dictionary={{
             change_language: dictionary.change_language || "Change Language",
             english: dictionary.english || "English",
             hindi: dictionary.hindi || "Hindi",
             kannada: dictionary.kannada || "Kannada"
          }} />
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs px-2 sm:px-3">
            <LogOut className="mr-0 sm:mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{dictionary.peace_out_reset}</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>

      </div>
    </header>
  );
}
