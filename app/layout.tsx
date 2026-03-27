import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/nav/TopNav'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default:  'codeworld',
    template: '%s | codeworld',
  },
  description: 'A collection of reference tools and interactive utilities for cyber operations, TSCM, and digital forensics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-zinc-950`}>
        <TopNav />
        <div className="h-screen pt-10 flex flex-col">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
