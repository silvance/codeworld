import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/nav/TopNav'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default:  'codeworld',
    template: '%s | codeworld',
  },
  description: 'Tools for cyber, TSCM, and digital forensics operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} font-mono antialiased bg-zinc-950`}>
        <TopNav />
        {children}
      </body>
    </html>
  )
}
