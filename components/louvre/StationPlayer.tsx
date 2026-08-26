'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react'
import type { Station } from '@/lib/louvre/types'
import SegmentRenderer from './SegmentRenderer'

const segmentVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

interface Props {
  station: Station
  initialSegmentIndex: number
  alreadyCompleted: boolean
  onProgress: (segmentIndex: number) => void
  onComplete: (codeword: string) => void
  onBack: () => void
}

export default function StationPlayer({
  station,
  initialSegmentIndex,
  alreadyCompleted,
  onProgress,
  onComplete,
  onBack,
}: Props) {
  const gotoTargets = useMemo(() => {
    const targets = new Set<string>()
    for (const segment of station.segments) {
      if (segment.type === 'choice') {
        for (const opt of segment.options) targets.add(opt.goto)
      }
    }
    return targets
  }, [station.segments])

  const [index, setIndex] = useState(
    initialSegmentIndex < station.segments.length ? initialSegmentIndex : 0
  )
  const [finished, setFinished] = useState(alreadyCompleted)

  const segment = station.segments[index]

  const handleFinished = (goto?: string) => {
    if (goto) {
      const targetIndex = station.segments.findIndex((s) => s.type === 'audio' && s.id === goto)
      if (targetIndex >= 0) {
        setIndex(targetIndex)
        onProgress(targetIndex)
        return
      }
    }

    const isBranchTarget = segment.type === 'audio' && gotoTargets.has(segment.id)
    const nextIndex = index + 1

    if (isBranchTarget || nextIndex >= station.segments.length) {
      setFinished(true)
      onComplete(station.codeword)
      return
    }

    setIndex(nextIndex)
    onProgress(nextIndex)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-louvre-navy-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Vissza az állomásokhoz
      </button>

      <div className="mb-6 flex items-start gap-2 rounded-lg bg-louvre-navy-50 p-3 text-sm text-louvre-navy-700">
        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
        {station.navigation}
      </div>

      <h1 className="mb-6 font-playfair text-3xl font-bold text-louvre-navy-700">{station.title}</h1>

      <AnimatePresence mode="wait">
        {!finished && (
          <motion.div
            key={segment.type === 'audio' ? segment.id : `${segment.type}-${index}`}
            variants={segmentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <SegmentRenderer segment={segment} stationTitle={station.title} onFinished={handleFinished} />
          </motion.div>
        )}

        {finished && (
          <motion.div
            key="finished"
            variants={segmentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="rounded-2xl border-2 border-louvre-gold-500 bg-louvre-gold-50 p-8 text-center"
          >
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-louvre-gold-700" />
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-louvre-navy-500">
              Állomás teljesítve -- a kódszavad:
            </p>
            <p className="mb-6 font-playfair text-4xl font-bold text-louvre-navy-700">{station.codeword}</p>
            <p className="mb-6 text-sm text-slate-600">
              Jegyezd meg ezt a szót -- a 3 állomás kódszavából áll össze a bónuszsáv jelszava.
            </p>
            <button
              onClick={onBack}
              className="rounded-full bg-louvre-navy-700 px-6 py-3 font-semibold text-white hover:bg-louvre-navy-500"
            >
              Következő állomás
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
