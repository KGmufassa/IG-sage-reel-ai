import "./globals.css"
import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Parallax Story Composer",
  description: "Sprint 1 backend foundation built with Next.js, Prisma, and PostgreSQL.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
