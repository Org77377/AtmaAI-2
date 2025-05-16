
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n-config';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  dictionary: {
    change_language: string;
    english: string;
    hindi: string;
    kannada: string;
  }
}

export default function LanguageSwitcher({ dictionary }: LanguageSwitcherProps) {
  const pathName = usePathname();
  const router = useRouter();

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  // Determine current locale from pathname for display
  const currentLocaleFromPath = pathName.split('/')[1] as Locale;
  const currentLanguageName = 
    currentLocaleFromPath === 'hi' ? dictionary.hindi :
    currentLocaleFromPath === 'kn' ? dictionary.kannada :
    dictionary.english;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguageName}</span>
          <span className="sm:hidden">{currentLocaleFromPath.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(redirectedPathName('en'))}
          disabled={currentLocaleFromPath === 'en'}
        >
          {dictionary.english}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(redirectedPathName('hi'))}
          disabled={currentLocaleFromPath === 'hi'}
        >
          {dictionary.hindi}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(redirectedPathName('kn'))}
          disabled={currentLocaleFromPath === 'kn'}
        >
          {dictionary.kannada}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
