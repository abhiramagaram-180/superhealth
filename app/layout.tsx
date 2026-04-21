import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Health Sanctuary',
  description: "Your family's health, perfectly curated.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${publicSans.className} bg-surface text-on-surface min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
