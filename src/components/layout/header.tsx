
"use client";

import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react';
import { MainNav } from '@/components/layout/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName');
      toast({
        title: "See Ya!",
        description: "You've been logged out. Enter a new name to start fresh.",
      });
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="mr-4 md:mr-8 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Aatme</span>
        </Link>
        <div className="flex-grow md:flex-grow-0">
         <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs px-2 sm:px-3">
            <LogOut className="mr-0 sm:mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Peace Out & Reset</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
