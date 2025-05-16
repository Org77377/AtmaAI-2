
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/guidance", label: "Chat" }, 
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About Us" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
      {navItems.map((item) => (
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
