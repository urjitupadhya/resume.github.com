import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '../components/providers'
import './globals.css'
import Navigation from '@/components/navigation'
export const metadata: Metadata = {
  title: 'Portfolio Generator',
  description: 'Created with Shubh Varshney',
  generator: 'Shubh Varshney',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
