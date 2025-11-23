"use client"
import { useEffect, useState } from 'react'
import { useDatabase } from '@/lib/db'
import { formatMoney } from '@/lib/utils'

export default function InvoicesPage() {
  const { ready, query } = useDatabase()
  const [orders, setOrders] = useState<any[]>([])

  const refresh = () => {
    const rows = query(`SELECT o.*, c.name as customer_name FROM orders o LEFT JOIN customers c ON c.id = o.customer_id ORDER BY o.id DESC`)
    setOrders(rows as any[])
  }

  useEffect(() => { if (ready) refresh() }, [ready])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">????????</h1>
      <div className="overflow-auto bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>#</Th>
              <Th>???????</Th>
              <Th>??????</Th>
              <Th>??????</Th>
              <Th>??????</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <Td>{o.id}</Td>
                <Td>{o.created_at}</Td>
                <Td>{o.customer_name || '????'}</Td>
                <Td>{o.status}</Td>
                <Td>{formatMoney(o.total_cents)}</Td>
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
