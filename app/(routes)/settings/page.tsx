"use client"
import { useState } from 'react'
import { useDatabase } from '@/lib/db'

export default function SettingsPage() {
  const { exportToBytes, importFromBytes } = useDatabase()
  const [busy, setBusy] = useState(false)

  const backup = () => {
    const bytes = exportToBytes()
    if (!bytes) return
    const blob = new Blob([bytes], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-backup.sqlite`;
    a.click()
    URL.revokeObjectURL(url)
  }

  const restore = async (file: File) => {
    setBusy(true)
    const arr = new Uint8Array(await file.arrayBuffer())
    await importFromBytes(arr)
    setBusy(false)
    alert('?? ????????? ?????')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">?????????</h1>
      <div className="bg-white border rounded p-4 space-y-3">
        <div className="space-x-2 space-x-reverse">
          <button className="btn" onClick={backup}>??? ???????</button>
          <label className="btn inline-flex items-center cursor-pointer">
            ??????? ????? ??????
            <input type="file" accept=".sqlite,.db,.sqlite3,application/octet-stream" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if (f) void restore(f) }} />
          </label>
        </div>
        {busy && <div className="text-sm text-gray-500">???? ?????????...</div>}
      </div>

      <style jsx>{`
        .btn { @apply bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark; }
      `}</style>
    </div>
  )
}
