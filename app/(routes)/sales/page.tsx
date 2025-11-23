"use client"
import { useEffect, useMemo, useState } from 'react'
import { useDatabase } from '@/lib/db'
import { formatMoney, nowIsoLocal } from '@/lib/utils'

type CartItem = { id: number, name: string, price_cents: number, quantity: number }

export default function SalesPage() {
  const { ready, query, execWrite } = useDatabase()
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [customers, setCustomers] = useState<any[]>([])

  const refresh = () => {
    setProducts(query(`SELECT * FROM products ORDER BY id DESC`) as any[])
    setCustomers(query(`SELECT id, name FROM customers ORDER BY id DESC`) as any[])
  }

  useEffect(() => { if (ready) refresh() }, [ready])

  const subtotal = cart.reduce((s, it) => s + it.price_cents * it.quantity, 0)
  const tax = Math.round(subtotal * 0.14) // 14% default tax
  const total = subtotal + tax

  const addToCart = (p: any) => {
    setCart((c) => {
      const idx = c.findIndex(x => x.id === p.id)
      if (idx >= 0) return c.map((x,i)=> i===idx ? { ...x, quantity: x.quantity + 1 } : x)
      return [...c, { id: p.id, name: p.name, price_cents: p.price_cents, quantity: 1 }]
    })
  }

  const checkout = () => {
    if (cart.length === 0) return
    execWrite(db => {
      db.run(`INSERT INTO orders(customer_id,status,subtotal_cents,tax_cents,total_cents,payment_status,created_at) VALUES ($c,'paid',$s,$t,$tt,'paid',$d)`,
        { $c: customerId, $s: subtotal, $t: tax, $tt: total, $d: nowIsoLocal() })
      const orderId = db.exec(`SELECT last_insert_rowid() as id`)[0].values[0][0] as number
      for (const it of cart) {
        const totalItem = it.price_cents * it.quantity
        db.run(`INSERT INTO order_items(order_id,product_id,quantity,unit_price_cents,total_cents) VALUES ($o,$p,$q,$u,$tt)`,
          { $o: orderId, $p: it.id, $q: it.quantity, $u: it.price_cents, $tt: totalItem })
        db.run(`UPDATE products SET stock_quantity = stock_quantity - $q WHERE id=$p`, { $q: it.quantity, $p: it.id })
        db.run(`INSERT INTO inventory_movements(product_id, delta, reason, related_order_id, created_at) VALUES ($p, -$q, 'sale', $o, $d)`,
          { $p: it.id, $q: it.quantity, $o: orderId, $d: nowIsoLocal() })
      }
      db.run(`INSERT INTO payments(order_id, amount_cents, method, created_at) VALUES ($o,$a,'cash',$d)`,
        { $o: orderId, $a: total, $d: nowIsoLocal() })
    })
    setCart([])
    refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">???? ?????</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border rounded p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map(p => (
              <button key={p.id} onClick={()=>addToCart(p)} className="border rounded p-3 text-right hover:shadow">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{p.sku}</div>
                <div className="text-brand font-semibold mt-1">{formatMoney(p.price_cents)}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white border rounded p-4 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm">??????:</label>
            <select className="border rounded px-2 py-1 flex-1" value={customerId ?? ''} onChange={e=>setCustomerId(e.target.value? Number(e.target.value): null)}>
              <option value="">????</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            {cart.length === 0 && <div className="text-sm text-gray-500">????? ?????</div>}
            {cart.map((it,i) => (
              <div key={i} className="flex items-center justify-between border-b py-2">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">{formatMoney(it.price_cents)} ? {it.quantity}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 border rounded" onClick={()=>setCart(c=>c.map((x,idx)=> idx===i? {...x, quantity: Math.max(1, x.quantity-1)}: x))}>-</button>
                  <button className="px-2 py-1 border rounded" onClick={()=>setCart(c=>c.map((x,idx)=> idx===i? {...x, quantity: x.quantity+1}: x))}>+</button>
                  <button className="text-red-600" onClick={()=>setCart(c=>c.filter((_,idx)=>idx!==i))}>???</button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>???????? ??????</span><span>{formatMoney(subtotal)}</span></div>
            <div className="flex justify-between"><span>???????</span><span>{formatMoney(tax)}</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>????????</span><span>{formatMoney(total)}</span></div>
          </div>
          <button className="btn w-full" onClick={checkout} disabled={cart.length===0}>????? ?????</button>
        </div>
      </div>

      <style jsx>{`
        .btn { @apply bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark; }
      `}</style>
    </div>
  )
}
