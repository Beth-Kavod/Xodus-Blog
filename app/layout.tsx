import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import RouterWrapper from '@/components/RouterWrapper';
// import { useRouter } from 'next/navigation '
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
      {/* <RouterWrapper> */}
        <body className={inter.className}>{children}</body>
      {/* </RouterWrapper> */}
    </html>
  )
}
