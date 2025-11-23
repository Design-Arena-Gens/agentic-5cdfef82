"use client"
import { useEffect, useMemo, useState } from 'react'
import { useDatabase } from '@/lib/db'
import { formatMoney } from '@/lib/utils'

export default function Dashboard() {
  const { ready, query } = useDatabase()
  const [stats, setStats] = useState<{today: number, month: number, orders: number}>({today: 0, month: 0, orders: 0})

  useEffect(() => {
    if (!ready) return
    const today = query<{ total: number }>(`SELECT COALESCE(SUM(total_cents),0) as total FROM orders WHERE DATE(created_at)=DATE('now','localtime')`)[0]?.total || 0
    const month = query<{ total: number }>(`SELECT COALESCE(SUM(total_cents),0) as total FROM orders WHERE strftime('%Y-%m', created_at)=strftime('%Y-%m','now','localtime')`)[0]?.total || 0
    const orders = query<{ c: number }>(`SELECT COUNT(*) as c FROM orders WHERE DATE(created_at)=DATE('now','localtime')`)[0]?.c || 0
    setStats({ today, month, orders })
  }, [ready, query])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">???? ???????</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="?????? ?????" value={formatMoney(stats.today)} />
        <Card title="?????? ?????" value={formatMoney(stats.month)} />
        <Card title="??? ???????? ?????" value={String(stats.orders)} />
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string, value: string }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  )
}
