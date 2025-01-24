"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
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