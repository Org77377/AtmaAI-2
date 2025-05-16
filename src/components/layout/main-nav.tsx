
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { ReactElement } from "react";

export interface NavItemType {
  href: string;
  label: string;
  icon?: ReactElement; 
}

interface MainNavProps {
  navItems: NavItemType[];
}

export function MainNav({ navItems }: MainNavProps) {
  const pathname = usePathname()

  const desktopNavItems = navItems.filter(item => {
    return !item.label.includes("Saved Quotes"); 
  });

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
