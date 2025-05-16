
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { ReactElement } from "react";

export interface NavItemType {
  href: string;
  label: string;
  icon?: ReactElement; // Icon is now an optional property
}

export const navItems: NavItemType[] = [
  { href: "/", label: "Home" },
  { href: "/guidance", label: "Chat" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About Us" },
  // Note: "Saved Quotes" is added to allNavItems in header.tsx, not directly here for MainNav
];

export function MainNav() {
  const pathname = usePathname()

  // Filter out items that should not be in the main desktop navigation, e.g., if they are mobile-only
  // For now, assuming all items in `navItems` (excluding Saved Quotes) are for desktop.
  const desktopNavItems = navItems.filter(item => item.href !== "/quotes/saved");


  return (
    <nav className="hidden md:flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
      {desktopNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
            "px-2 py-1 sm:px-3"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
