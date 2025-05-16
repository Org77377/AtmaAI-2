
"use client";

import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react'; // Added LogOut icon
import { MainNav } from '@/components/layout/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // To redirect
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
      // router.push('/'); // This will refresh the page and page.tsx logic will handle showing the name input
      // A simple window.location.reload() might be more straightforward if page.tsx handles the logic
      window.location.href = '/'; // Force a reload to root, page.tsx will pick it up
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Aatme</span>
        </Link>
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs">
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Peace Out & Reset
          </Button>
        </div>
      </div>
    </header>
  );
}
