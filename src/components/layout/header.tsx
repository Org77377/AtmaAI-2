
"use client";

import Link from 'next/link';
import { Sparkles, LogOut, Menu, Bookmark } from 'lucide-react';
import { MainNav, navItems } from '@/components/layout/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
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
      window.location.href = '/'; // Force full page reload to home
    }
  };

  const allNavItems = [
    ...navItems,
    { href: "/quotes/saved", label: "Saved Quotes", icon: <Bookmark className="mr-2 h-4 w-4" /> }
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="mr-4 md:mr-8 flex items-baseline space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <span className="font-bold text-lg">AatmAI</span>
            <span className="ml-1.5 text-xs text-muted-foreground">your AI therapist</span>
          </div>
        </Link>

        <div className="hidden md:flex md:flex-grow">
         <MainNav />
        </div>

        <div className="hidden md:flex items-center justify-end space-x-1 sm:space-x-2 ml-auto">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs px-2 sm:px-3">
            <LogOut className="mr-0 sm:mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Peace Out & Reset</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>

        <div className="md:hidden flex flex-1 items-center justify-end space-x-2">
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
                  <Link href="/" className="flex items-baseline space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Sparkles className="h-6 w-6 text-primary" />
                     <div>
                        <span className="font-bold text-lg">AatmAI</span>
                        <span className="ml-1.5 text-xs text-muted-foreground">your AI therapist</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-1 p-4">
                {allNavItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                     <Link
                       href={item.href}
                       className={cn(
                         "block px-3 py-2 rounded-md text-base font-medium",
                         pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                        Peace Out & Reset
                    </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
