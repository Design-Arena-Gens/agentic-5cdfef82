"use client"
import { useEffect, useMemo, useState } from 'react'
import { useDatabase } from '@/lib/db'
import { formatMoney, nowIsoLocal } from '@/lib/utils'

export default function ProductsPage() {
  const { ready, query, execWrite } = useDatabase()
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ sku: '', name: '', price: '', cost: '', tax: '', stock: '' })

  const refresh = () => {
    const rows = query(`SELECT * FROM products ORDER BY id DESC`)
    setItems(rows as any[])
  }

  useEffect(() => { if (ready) refresh() }, [ready])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    execWrite((db) => {
      db.run(
        `INSERT INTO products(sku,name,description,price_cents,cost_cents,tax_bps,stock_quantity,created_at)
         VALUES ($sku,$name,'', $price,$cost,$tax,$stock,$created)`,
        {
          $sku: form.sku,
          $name: form.name,
          $price: Math.round(Number(form.price) * 100) || 0,
          $cost: Math.round(Number(form.cost) * 100) || 0,
          $tax: Math.round(Number(form.tax) * 100) || 0,
          $stock: Number(form.stock) || 0,
          $created: nowIsoLocal(),
        }
      )
    })
    setForm({ sku: '', name: '', price: '', cost: '', tax: '', stock: '' })
    refresh()
  }

  const remove = (id: number) => {
    execWrite((db) => db.run(`DELETE FROM products WHERE id=$id`, { $id: id }))
    refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">????????</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-white p-4 border rounded">
        <input required value={form.sku} onChange={e=>setForm(f=>({...f, sku:e.target.value}))} placeholder="SKU" className="input" />
        <input required value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} placeholder="?????" className="input" />
        <input required value={form.price} onChange={e=>setForm(f=>({...f, price:e.target.value}))} placeholder="?????" className="input" />
        <input value={form.cost} onChange={e=>setForm(f=>({...f, cost:e.target.value}))} placeholder="???????" className="input" />
        <input value={form.tax} onChange={e=>setForm(f=>({...f, tax:e.target.value}))} placeholder="??????? %" className="input" />
        <input value={form.stock} onChange={e=>setForm(f=>({...f, stock:e.target.value}))} placeholder="???????" className="input" />
        <div className="col-span-2 md:col-span-6">
          <button className="btn">????? ????</button>
        </div>
      </form>

      <div className="overflow-auto bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>ID</Th>
              <Th>SKU</Th>
              <Th>?????</Th>
              <Th>?????</Th>
              <Th>???????</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <Td>{p.id}</Td>
                <Td>{p.sku}</Td>
                <Td>{p.name}</Td>
                <Td>{formatMoney(p.price_cents)}</Td>
                <Td>{p.stock_quantity}</Td>
                <Td>
                  <button onClick={()=>remove(p.id)} className="text-red-600 hover:underline">???</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .input { @apply border rounded px-3 py-2 w-full; }
        .btn { @apply bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark; }
      `}</style>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-right p-2 font-medium">{children}</th> }
function Td({ children }: { children: React.ReactNode }) { return <td className="p-2">{children}</td> }
