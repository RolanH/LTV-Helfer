"use client"

import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import Navbar from "@/components/navbar"

export const metadata = {
  title: "LTV Helfer App",
  description: "Helferorganisation für Lüdenscheider Turnverein von 1861",
  manifest: "/manifest.json"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-background text-foreground">
        <ClerkProvider>
          <Navbar />

          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
} 