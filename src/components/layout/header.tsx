
"use client";

import Link from 'next/link';
import { Sparkles, LogOut, Menu } from 'lucide-react';
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
      router.replace('/'); // Use replace to avoid adding to history
      router.refresh(); 
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="mr-4 md:mr-8 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Aatme</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-grow"> {/* Allow main nav to grow */}
         <MainNav />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end space-x-1 sm:space-x-2 ml-auto"> {/* Added ml-auto to push to the right */}
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs px-2 sm:px-3">
            <LogOut className="mr-0 sm:mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Peace Out & Reset</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>

        {/* Mobile Menu Trigger & Theme Toggle */}
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
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">Aatme</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-1 p-4">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                     <Link 
                       href={item.href} 
                       className={cn(
                         "block px-3 py-2 rounded-md text-base font-medium",
                         pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                       )}
                       onClick={() => setIsMobileMenuOpen(false)}
                     >
                       {item.label}
                     </Link>
                  </SheetClose>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="p-4 space-y-4">
                {/* Theme toggle is already outside for mobile, but can be kept here for consistency if sheet is always used */}
                {/* 
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                */}
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
