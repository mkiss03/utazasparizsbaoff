'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Ticket, Plus, Copy, Ban, RotateCcw, Trash2, FlaskConical, Loader2, CheckCircle2 } from 'lucide-react'
import { generateVouchers, setVoucherRevoked, deleteVoucher, activateVoucher, swapVoucherDevice } from '@/lib/actions/louvre-vouchers'

interface Voucher {
  code: string
  email: string | null
  batch_size: number
  notes: string | null
  created_at: string
  activated_at: string | null
  expires_at: string | null
  device_id: string | null
  device_swaps: number
  revoked: boolean
}

function status(v: Voucher): { label: string; className: string } {
  if (v.revoked) return { label: 'Visszavonva', className: 'bg-slate-200 text-slate-600' }
  if (!v.activated_at) return { label: 'Aktiválatlan', className: 'bg-slate-100 text-slate-600' }
  if (v.expires_at && new Date(v.expires_at) < new Date()) return { label: 'Lejárt', className: 'bg-red-100 text-red-700' }
  return { label: 'Aktív', className: 'bg-green-100 text-green-700' }
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-louvre-gold-500 focus:ring-1 focus:ring-louvre-gold-500'

export default function VouchersAdmin() {
  const supabase = createClient()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)

  const [count, setCount] = useState(1)
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [generating, setGenerating] = useState(false)
  const [newCodes, setNewCodes] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [testCode, setTestCode] = useState('')
  const [testDeviceId, setTestDeviceId] = useState('')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('louvre_vouchers').select('*').order('created_at', { ascending: false })
    setVouchers((data as Voucher[]) ?? [])
    setLoading(false)
  }

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    setNewCodes(null)
    const result = await generateVouchers({ count, email: email || undefined, notes: notes || undefined, batchSize: count })
    setGenerating(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    setNewCodes(result.data.codes)
    setEmail('')
    setNotes('')
    await load()
  }

  async function handleRevoke(code: string, revoked: boolean) {
    await setVoucherRevoked(code, revoked)
    await load()
  }

  async function handleDelete(code: string) {
    if (!confirm(`Biztosan törlöd ezt a kódot?\n\n${code}`)) return
    await deleteVoucher(code)
    await load()
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {})
  }

  async function handleTestActivate() {
    setTesting(true)
    setTestResult(null)
    const deviceId = testDeviceId || crypto.randomUUID()
    setTestDeviceId(deviceId)
    const result = await activateVoucher(testCode, deviceId)
    setTesting(false)
    setTestResult(
      result.success
        ? `Sikeres aktiválás -- érvényes eddig: ${new Date(result.data.expiresAt).toLocaleString('hu-HU')}`
        : `Hiba: ${result.error}`
    )
    await load()
  }

  async function handleTestSwap() {
    setTesting(true)
    setTestResult(null)
    const newDeviceId = crypto.randomUUID()
    const result = await swapVoucherDevice(testCode, newDeviceId)
    setTesting(false)
    setTestDeviceId(newDeviceId)
    setTestResult(
      result.success
        ? `Sikeres eszközcsere -- új teszt-eszközazonosító: ${newDeviceId.slice(0, 8)}...`
        : `Hiba: ${result.error}`
    )
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-louvre-navy-700">
          <Plus className="h-4 w-4" />
          Kódok generálása
        </h2>
        <div className="grid gap-3 sm:grid-cols-[100px,1fr,1fr]">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Darab</label>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Email (opcionális)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="vevo@email.hu" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Megjegyzés (pl. hogyan fizetett)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} placeholder="banki utalás, 2026.08.26" />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-4 flex items-center gap-2 rounded-full bg-louvre-navy-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-louvre-navy-500 disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
          Generálás
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {newCodes && (
          <div className="mt-4 rounded-lg bg-louvre-gold-50 p-4">
            <p className="mb-2 text-sm font-semibold text-louvre-navy-700">Új kódok -- másold ki és küldd el kézzel:</p>
            <div className="space-y-1">
              {newCodes.map((code) => (
                <div key={code} className="flex items-center justify-between gap-2 rounded bg-white px-3 py-2 font-mono text-sm">
                  {code}
                  <button onClick={() => copy(code)} className="text-slate-400 hover:text-louvre-navy-700">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-louvre-navy-700">
          <FlaskConical className="h-4 w-4" />
          Kód tesztelése (aktiválás / eszközcsere logika)
        </h2>
        <p className="mb-3 text-xs text-slate-500">
          Ez a panel egy véletlen teszt-eszközazonosítóval hívja meg ugyanazt az aktiválási logikát, amit majd a
          nyilvános beváltó felület is használ -- így most, a fizetős checkout nélkül is ellenőrizhető, hogy a 48
          órás ablak, az eszközkötés és az egyszeri csere helyesen működik.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            placeholder="LVR-XXXX-XXXX"
            className={`${inputClass} font-mono sm:max-w-xs`}
          />
          <div className="flex gap-2">
            <button
              onClick={handleTestActivate}
              disabled={testing || !testCode}
              className="flex items-center gap-1 rounded-lg border-2 border-louvre-navy-700 px-4 py-2 text-sm font-semibold text-louvre-navy-700 hover:bg-louvre-navy-50 disabled:opacity-50"
            >
              Aktiválás (jelenlegi teszt-eszköz)
            </button>
            <button
              onClick={handleTestSwap}
              disabled={testing || !testCode}
              className="flex items-center gap-1 rounded-lg border-2 border-louvre-gold-500 px-4 py-2 text-sm font-semibold text-louvre-navy-700 hover:bg-louvre-gold-50 disabled:opacity-50"
            >
              Eszközcsere (új teszt-eszköz)
            </button>
          </div>
        </div>
        {testDeviceId && <p className="mt-2 text-xs text-slate-400">Aktuális teszt-eszközazonosító: {testDeviceId}</p>}
        {testResult && (
          <p className={`mt-2 flex items-center gap-1 text-sm ${testResult.startsWith('Hiba') ? 'text-red-600' : 'text-green-700'}`}>
            {!testResult.startsWith('Hiba') && <CheckCircle2 className="h-4 w-4" />}
            {testResult}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="mb-4 font-semibold text-louvre-navy-700">Kiadott kódok ({vouchers.length})</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Betöltés...</p>
        ) : vouchers.length === 0 ? (
          <p className="text-sm text-slate-400">Még nincs egy kód sem generálva.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Kód</th>
                  <th className="px-3 py-2">Email / megjegyzés</th>
                  <th className="px-3 py-2">Állapot</th>
                  <th className="px-3 py-2">Lejár</th>
                  <th className="px-3 py-2">Csere</th>
                  <th className="px-3 py-2">Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => {
                  const s = status(v)
                  return (
                    <tr key={v.code} className="border-b border-slate-100">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">{v.code}</td>
                      <td className="px-3 py-2 text-slate-600">
                        {v.email && <div>{v.email}</div>}
                        {v.notes && <div className="text-xs text-slate-400">{v.notes}</div>}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.className}`}>{s.label}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-500">
                        {v.expires_at ? new Date(v.expires_at).toLocaleString('hu-HU') : '--'}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">{v.device_swaps}/1</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRevoke(v.code, !v.revoked)}
                            title={v.revoked ? 'Visszavonás feloldása' : 'Visszavonás'}
                            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            {v.revoked ? <RotateCcw className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(v.code)}
                            title="Törlés"
                            className="rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
