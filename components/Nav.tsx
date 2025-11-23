"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/', label: '???? ???????' },
  { href: '/sales', label: '???? ?????' },
  { href: '/products', label: '????????' },
  { href: '/customers', label: '???????' },
  { href: '/invoices', label: '????????' },
  { href: '/reports', label: '????????' },
  { href: '/settings', label: '?????????' },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:block w-64 border-l md:border-l-0 md:border-r bg-white">
      <div className="p-4 font-bold text-lg">???? ????????</div>
      <nav className="flex flex-col">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={clsx(
            'px-4 py-3 hover:bg-gray-50 border-b text-sm',
            pathname === l.href && 'bg-blue-50 text-blue-700 font-medium'
          )}>{l.label}</Link>
        ))}
      </nav>
    </aside>
  )
}
