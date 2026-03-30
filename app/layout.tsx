import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/nav/TopNav'

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
    default:  'codeworld.codes',
    template: '%s | codeworld.codes',
  },
  description: 'Reference tools and cheat sheets for digital forensics, TSCM, penetration testing, mobile forensics, network analysis, and malware analysis. Browser-native utilities including hash tools, subnet calculator, timestamp converter, and email header analyzer.',
  keywords: [
    'digital forensics', 'DFIR', 'TSCM', 'technical surveillance countermeasures',
    'penetration testing', 'pentest cheat sheet', 'mobile forensics', 'Android forensics',
    'iOS forensics', 'Metasploit', 'BloodHound', 'Active Directory attacks',
    'Wireshark filters', 'Nmap reference', 'SRUM forensics', 'Shellbags',
    'Prefetch forensics', 'email header analyzer', 'SPF DKIM DMARC',
    'hash calculator', 'subnet calculator', 'OSINT reference',
    'malware analysis', 'YARA rules', 'incident response',
  ],
  authors: [{ name: 'codeworld.codes' }],
  creator: 'codeworld.codes',
  metadataBase: new URL('https://codeworld.codes'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://codeworld.codes',
    siteName: 'codeworld.codes',
    title: 'codeworld.codes — DFIR, TSCM & Pentest Reference',
    description: 'Comprehensive reference tools for digital forensics, TSCM, penetration testing, mobile forensics, and network analysis. All utilities run locally in the browser.',
  },
  twitter: {
    card: 'summary',
    title: 'codeworld.codes — DFIR, TSCM & Pentest Reference',
    description: 'Reference tools and cheat sheets for digital forensics, TSCM, pentesting, and network analysis.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
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
      </body>
    </html>
  )
}
