"use client"
import { useEffect, useState } from 'react'
import { useDatabase } from '@/lib/db'
import { formatMoney } from '@/lib/utils'

export default function ReportsPage() {
  const { ready, query } = useDatabase()
  const [rows, setRows] = useState<any[]>([])

  const refresh = () => {
    const rs = query(`
      SELECT DATE(created_at) as day,
             SUM(subtotal_cents) as subtotal,
             SUM(tax_cents) as tax,
             SUM(total_cents) as total,
             COUNT(*) as orders
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY day DESC
      LIMIT 30
    `)
    setRows(rs as any[])
  }

  useEffect(() => { if (ready) refresh() }, [ready])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">????????</h1>
      <div className="overflow-auto bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>?????</Th>
              <Th>??? ????????</Th>
              <Th>????????</Th>
              <Th>???????</Th>
              <Th>??????</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.day} className="border-t">
                <Td>{r.day}</Td>
                <Td>{r.orders}</Td>
                <Td>{formatMoney(r.total)}</Td>
                <Td>{formatMoney(r.tax)}</Td>
                <Td>{formatMoney(r.subtotal)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-right p-2 font-medium">{children}</th> }
function Td({ children }: { children: React.ReactNode }) { return <td className="p-2">{children}</td> }
