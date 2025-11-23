"use client"
import { DatabaseProvider } from '@/lib/db'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <DatabaseProvider>{children}</DatabaseProvider>
}
