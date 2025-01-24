"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="w-full border-b border-border bg-background">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-4">
        {/* Logo / Title */}
        <div>
          <Link
            href="/"
            className="text-xl font-bold text-primary"
          >
            Helfer-App
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Link
            href="/events"
            className={`text-sm font-medium ${
              pathname.startsWith("/events")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Events
          </Link>
          <Link
            href="/profile"
            className={`text-sm font-medium ${
              pathname.startsWith("/profile")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Profil
          </Link>
        </div>

        {/* User Button */}
        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
} 