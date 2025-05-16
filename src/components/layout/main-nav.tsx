
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { ReactElement } from "react";
import type { Locale } from "@/lib/i18n-config";

export interface NavItemType {
  href: string;
  label: string;
  icon?: ReactElement; 
}

// Removed the default navItems array here, it will be passed as a prop

interface MainNavProps {
  navItems: NavItemType[];
  currentLocale: Locale;
}

export function MainNav({ navItems, currentLocale }: MainNavProps) {
  const pathname = usePathname()

  // Filter out items like "Saved Quotes" if they are mobile-only or not part of primary nav
  // The navItems prop already contains the correct items for desktop
  const desktopNavItems = navItems.filter(item => {
    // Example: exclude if icon is present, assuming icons are for mobile-only specific items
    // or if label matches a mobile-only item.
    // For now, assume all passed navItems are for desktop unless explicitly handled.
    return !item.label.includes("Saved Quotes"); // Simple exclusion
  });


  return (
    <nav className="hidden md:flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
      {desktopNavItems.map((item) => {
        // Determine if the link is for the localized home or an unlocalized page
        const isLocalizedHome = item.href === `/${currentLocale}`;
        const finalHref = item.href; // Links are already constructed with locale or are to non-localized pages

        return (
          <Link
            key={item.href}
            href={finalHref}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              // Adjust active state check for localized home vs other pages
              pathname === finalHref ? "text-primary" : "text-muted-foreground",
              "px-2 py-1 sm:px-3"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  )
}
