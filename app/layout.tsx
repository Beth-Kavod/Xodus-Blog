import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xodus Blog',
  description: 'A blog cataloguing the Exodus out of mystery Babylon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
