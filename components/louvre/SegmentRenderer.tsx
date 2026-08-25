'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipForward } from 'lucide-react'
import type { AudioSegment, ChoiceSegment, PauseSegment, Segment } from '@/lib/louvre/types'

interface CommonProps {
  stationTitle: string
  onFinished: (goto?: string) => void
}

export default function SegmentRenderer({
  segment,
  stationTitle,
  onFinished,
}: CommonProps & { segment: Segment }) {
  if (segment.type === 'audio') {
    return <AudioSegmentView segment={segment} stationTitle={stationTitle} onFinished={onFinished} />
  }
  if (segment.type === 'pause') {
    return <PauseSegmentView segment={segment} onFinished={onFinished} />
  }
  return <ChoiceSegmentView segment={segment} onFinished={onFinished} />
}

function AudioSegmentView({
  segment,
  stationTitle,
  onFinished,
}: CommonProps & { segment: AudioSegment }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.play().catch(() => {
      // Autoplay letiltva -- a felhasználónak kézzel kell indítania.
    })

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: stationTitle,
        artist: 'Louvre hangos túra',
        album: 'Utazás Párizsba',
      })
      navigator.mediaSession.setActionHandler('play', () => audio.play())
      navigator.mediaSession.setActionHandler('pause', () => audio.pause())
    }

    return () => {
      audio.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment.src])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play()
    else audio.pause()
  }

  const progressPct = segment.duration > 0 ? Math.min(100, (currentTime / segment.duration) * 100) : 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <audio
        ref={audioRef}
        src={segment.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => onFinished()}
      />

      {segment.caption && <p className="mb-6 text-lg leading-relaxed text-slate-800">{segment.caption}</p>}

      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-louvre-gold-500 transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Szünet' : 'Lejátszás'}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-louvre-navy-700 text-white shadow-lg transition-transform hover:scale-105"
        >
          {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
        </button>
      </div>
    </div>
  )
}

function PauseSegmentView({ segment, onFinished }: { segment: PauseSegment } & Pick<CommonProps, 'onFinished'>) {
  const [remaining, setRemaining] = useState(segment.sec)

  useEffect(() => {
    if (remaining <= 0) {
      const t = setTimeout(() => onFinished(), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, onFinished])

  return (
    <div className="rounded-2xl border border-louvre-gold-300 bg-louvre-gold-50 p-8 text-center">
      <p className="mb-6 text-lg font-medium text-louvre-navy-700">{segment.prompt}</p>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-louvre-gold-500 text-2xl font-bold text-louvre-navy-700">
        {remaining}
      </div>
      <button
        onClick={() => onFinished()}
        className="inline-flex items-center gap-2 rounded-full border-2 border-louvre-navy-700 px-5 py-2 text-sm font-semibold text-louvre-navy-700 hover:bg-louvre-navy-700 hover:text-white"
      >
        <SkipForward className="h-4 w-4" />
        Ugorj
      </button>
    </div>
  )
}

function ChoiceSegmentView({ segment, onFinished }: { segment: ChoiceSegment } & Pick<CommonProps, 'onFinished'>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <p className="mb-6 text-lg font-medium text-louvre-navy-700">{segment.question}</p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        {segment.options.map((opt) => (
          <button
            key={opt.goto}
            onClick={() => onFinished(opt.goto)}
            className="rounded-full bg-louvre-navy-700 px-6 py-3 font-semibold text-white transition-all hover:bg-louvre-navy-500"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
