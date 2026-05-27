import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BreakupBox — Your Digital Untangling Checklist',
  description: 'Untangle your digital life after a breakup. AI-powered personalized checklist for every app, account, and shared service you need to disconnect.',
  keywords: ['breakup', 'digital detox', 'account security', 'breakup checklist', 'shared accounts'],
  openGraph: {
    title: 'BreakupBox — Your Digital Untangling Checklist',
    description: 'Untangle your digital life after a breakup. AI-powered personalized checklist.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
