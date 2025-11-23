import './globals.css'
import Link from 'next/link'
import { Nav } from '@/components/Nav'

export const metadata = {
  title: '???? ????????',
  description: '???? ?????? ?????? ???? ??? SQLite ??? ???????',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <Nav />
          <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
