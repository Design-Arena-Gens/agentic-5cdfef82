"use client"
import { useEffect, useState } from 'react'
import { useDatabase } from '@/lib/db'
import { nowIsoLocal } from '@/lib/utils'

export default function CustomersPage() {
  const { ready, query, execWrite } = useDatabase()
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })

  const refresh = () => setItems(query(`SELECT * FROM customers ORDER BY id DESC`) as any[])

  useEffect(() => { if (ready) refresh() }, [ready])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    execWrite(db => {
      db.run(`INSERT INTO customers(name,phone,email,address,created_at) VALUES ($n,$p,$e,$a,$c)`,
        { $n: form.name, $p: form.phone, $e: form.email, $a: form.address, $c: nowIsoLocal() })
    })
    setForm({ name: '', phone: '', email: '', address: '' })
    refresh()
  }

  const remove = (id: number) => { execWrite(db => db.run(`DELETE FROM customers WHERE id=$id`, { $id: id })); refresh() }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">???????</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white p-4 border rounded">
        <input required value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} placeholder="?????" className="input" />
        <input value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} placeholder="??????" className="input" />
        <input value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} placeholder="??????" className="input" />
        <input value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} placeholder="???????" className="input" />
        <div className="col-span-2 md:col-span-5"><button className="btn">????? ????</button></div>
      </form>

      <div className="overflow-auto bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>ID</Th>
              <Th>?????</Th>
              <Th>??????</Th>
              <Th>??????</Th>
              <Th>???????</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-t">
                <Td>{c.id}</Td>
                <Td>{c.name}</Td>
                <Td>{c.phone}</Td>
                <Td>{c.email}</Td>
                <Td>{c.address}</Td>
                <Td><button onClick={()=>remove(c.id)} className="text-red-600 hover:underline">???</button></Td>
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
