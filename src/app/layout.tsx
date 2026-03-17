import "./globals.css"
import type { Metadata } from "next"
import { Fraunces, IBM_Plex_Mono } from "next/font/google"
import { ReactNode } from "react"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Parallax Story Composer",
  description: "Sprint 1 backend foundation built with Next.js, Prisma, and PostgreSQL.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  )
}
