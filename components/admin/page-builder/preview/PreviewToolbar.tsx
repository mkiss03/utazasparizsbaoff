'use client'

import { Monitor, Tablet, Smartphone } from 'lucide-react'

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

interface PreviewToolbarProps {
  device: DeviceMode
  onDeviceChange: (device: DeviceMode) => void
}

const devices: { mode: DeviceMode; icon: typeof Monitor; label: string; width: number }[] = [
  { mode: 'desktop', icon: Monitor, label: 'Desktop', width: 1440 },
  { mode: 'tablet', icon: Tablet, label: 'Tablet', width: 768 },
  { mode: 'mobile', icon: Smartphone, label: 'Mobil', width: 375 },
]

export default function PreviewToolbar({ device, onDeviceChange }: PreviewToolbarProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
      {devices.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onDeviceChange(mode)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            device === mode
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
