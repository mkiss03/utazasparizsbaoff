'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { saveDraftAsRequest } from '@/lib/actions/planner'
import { computePlacePreviewCandidates } from '@/app/programtervezo/_components/catalogAdjust'
import {
  computeTripDays,
  deriveWeatherFallback,
  tripStartDateOnly,
  INITIAL_WIZARD_STATE,
  type WizardState,
} from '@/app/programtervezo/_components/types'
import { buildAdjustedCatalog } from '@/app/programtervezo/_components/catalogAdjust'
import { generateItinerary } from '@/lib/planner/engine'
import { mockDestinationId, mockRules } from '@/lib/planner/mock-catalog'
import type { ItineraryDay, ProgramItem, TravelerPreferences } from '@/lib/planner/types'
import type { FlowGraph, FlowNode } from '@/lib/planner/flow-types'
import ClosingTemplate from './templates/ClosingTemplate'
import ContactFormTemplate from './templates/ContactFormTemplate'
import DateTimeRangeTemplate from './templates/DateTimeRangeTemplate'
import FreeTextTemplate from './templates/FreeTextTemplate'
import HeroTemplate from './templates/HeroTemplate'
import MonthCounterTemplate from './templates/MonthCounterTemplate'
import MultiSelectTemplate from './templates/MultiSelectTemplate'
import SingleSelectTemplate from './templates/SingleSelectTemplate'
import SwipeCardsTemplate from './templates/SwipeCardsTemplate'

interface RuntimeSnapshot {
  nodeId: string
  values: Record<string, unknown>
  pendingQueue: string[]
}

const HIGHLIGHT_COUNT = 3

function pickHighlights(draftDays: ItineraryDay[]): ProgramItem[] {
  const seen = new Set<string>()
  const items: ProgramItem[] = []
  for (const day of draftDays) {
    for (const slot of day.slots) {
      if (seen.has(slot.item.id)) continue
      seen.add(slot.item.id)
      items.push(slot.item)
    }
  }
  return items.sort((a, b) => b.priority - a.priority).slice(0, HIGHLIGHT_COUNT)
}

/** A generikus gráf-válaszokat visszavetíti a meglévő WizardState alakra, hogy a motor-wiringot (napok, tempó, érdeklődés, katalógus-finomítás) ne kelljen újraírni. */
function buildSyntheticState(nodes: FlowNode[], values: Record<string, unknown>): WizardState {
  const state: WizardState = { ...INITIAL_WIZARD_STATE }

  for (const n of nodes) {
    const value = values[n.id]
    if (value === undefined) continue
    const data = n.data

    if (data.kind === 'single-select' && data.binding !== 'none') {
      const option = data.options.find((o) => o.id === value)
      const bound = option?.value ?? (value as string)
      if (data.binding === 'pace') state.pace = bound as WizardState['pace']
      if (data.binding === 'budgetBand') state.budgetBand = bound as WizardState['budgetBand']
    }

    if (data.kind === 'multi-select' && data.binding === 'interests') {
      const selectedIds = value as string[]
      const tags = selectedIds.map((id) => data.options.find((o) => o.id === id)?.value ?? id)
      state.interests = Array.from(new Set([...state.interests, ...tags]))
    }

    if (data.kind === 'datetime-range' && data.binding === 'days-exact') {
      const { start, end } = value as { start: string; end: string }
      if (start && end) {
        state.flightStatus = 'booked'
        state.tripStart = start
        state.tripEnd = end
      }
    }

    if (data.kind === 'month-counter' && data.binding === 'days-approx') {
      const { month, days } = value as { month: string; days: number }
      state.approxMonth = month ?? ''
      state.approxDays = days ?? state.approxDays
      if (state.flightStatus !== 'booked') state.flightStatus = 'planning-self'
    }

    if (data.kind === 'swipe-cards') {
      const { liked, disliked } = value as { liked: string[]; disliked: string[] }
      state.likedItemIds = liked ?? []
      state.dislikedItemIds = disliked ?? []
    }

    if (data.kind === 'contact-form') {
      const { name, email } = value as { name: string; email: string }
      state.name = name ?? ''
      state.email = email ?? ''
    }
  }

  return state
}

function humanizeAnswer(node: FlowNode, value: unknown): unknown {
  const data = node.data
  if (data.kind === 'single-select') {
    return data.options.find((o) => o.id === value)?.label ?? value
  }
  if (data.kind === 'multi-select') {
    const ids = value as string[]
    return ids.map((id) => data.options.find((o) => o.id === id)?.label ?? id)
  }
  return value
}

export default function FlowRuntime({ graph, onExit }: { graph: FlowGraph; onExit?: () => void }) {
  const startNodeId = graph.nodes[0]?.id
  const [history, setHistory] = useState<RuntimeSnapshot[]>([
    { nodeId: startNodeId, values: {}, pendingQueue: [] },
  ])
  const [highlights, setHighlights] = useState<ProgramItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const current = history[history.length - 1]
  const node = useMemo(() => graph.nodes.find((n) => n.id === current.nodeId), [graph, current.nodeId])

  const goBack = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
  }, [])

  const advance = useCallback(
    (value: unknown) => {
      setHistory((h) => {
        const last = h[h.length - 1]
        const values = { ...last.values, [last.nodeId]: value }

        if (last.pendingQueue.length > 0) {
          const [nextId, ...rest] = last.pendingQueue
          return [...h, { nodeId: nextId, values, pendingQueue: rest }]
        }

        const currentNode = graph.nodes.find((n) => n.id === last.nodeId)
        if (!currentNode) return h
        const outgoing = graph.edges.filter((e) => e.source === last.nodeId)

        if (currentNode.data.kind === 'multi-select') {
          const selected = (value as string[]) ?? []
          const detourTargets = outgoing
            .filter((e) => e.sourceHandle && selected.includes(e.sourceHandle))
            .map((e) => e.target)
          if (detourTargets.length > 0) {
            const [first, ...rest] = detourTargets
            return [...h, { nodeId: first, values, pendingQueue: rest }]
          }
          const def = outgoing.find((e) => !e.sourceHandle)?.target
          return def ? [...h, { nodeId: def, values, pendingQueue: [] }] : h
        }

        if (currentNode.data.kind === 'single-select') {
          const chosen = value as string
          const target =
            outgoing.find((e) => e.sourceHandle === chosen)?.target ??
            outgoing.find((e) => !e.sourceHandle)?.target
          return target ? [...h, { nodeId: target, values, pendingQueue: [] }] : h
        }

        const def = outgoing.find((e) => !e.sourceHandle)?.target ?? outgoing[0]?.target
        return def ? [...h, { nodeId: def, values, pendingQueue: [] }] : h
      })
    },
    [graph]
  )

  const handleSubmit = useCallback(
    async (contactValue: { name: string; email: string }) => {
      setIsSubmitting(true)

      const values = { ...current.values, [current.nodeId]: contactValue }
      const state = buildSyntheticState(graph.nodes, values)

      const preferences: TravelerPreferences = {
        days: computeTripDays(state),
        pace: state.pace,
        interests: state.interests,
        startDate: tripStartDateOnly(state),
        weatherFallback: deriveWeatherFallback(state),
      }

      const adjustedCatalog = buildAdjustedCatalog(state)
      const draft = generateItinerary(adjustedCatalog, mockRules, preferences)
      setHighlights(pickHighlights(draft.days))

      const answers: Record<string, unknown> = {}
      for (const n of graph.nodes) {
        if (values[n.id] === undefined) continue
        answers[n.id] = { question: n.data.title, answer: humanizeAnswer(n, values[n.id]) }
      }

      try {
        await saveDraftAsRequest({
          destinationSlug: mockDestinationId,
          contactEmail: contactValue.email,
          contactName: contactValue.name || undefined,
          draft,
          guestContext: { flowAnswers: answers },
        })
      } catch {
        // A dev DB elérhetetlensége nem szabad, hogy megakassza az előnézetet.
      }

      setIsSubmitting(false)
      advance(contactValue)
    },
    [current, graph.nodes, advance]
  )

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center font-montserrat text-parisian-grey-500">
        Nincs kezdő node a flow-ban -- adj hozzá egy "Nyitány" node-ot.
      </div>
    )
  }

  const syntheticStateSoFar = buildSyntheticState(graph.nodes, current.values)

  return (
    <div className="relative h-full w-full">
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="fixed right-6 top-6 z-40 rounded-full bg-parisian-grey-900/80 px-4 py-2 font-montserrat text-sm font-medium text-white backdrop-blur-sm hover:bg-parisian-grey-900"
        >
          Előnézet bezárása
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={current.nodeId}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full"
        >
          {node.data.kind === 'hero' && <HeroTemplate data={node.data} onNext={() => advance(true)} />}

          {node.data.kind === 'single-select' && (
            <SingleSelectTemplate data={node.data} onSelect={(id) => advance(id)} onBack={goBack} />
          )}

          {node.data.kind === 'multi-select' && (
            <MultiSelectTemplate data={node.data} onSubmit={(ids) => advance(ids)} onBack={goBack} />
          )}

          {node.data.kind === 'datetime-range' && (
            <DateTimeRangeTemplate
              data={node.data}
              start={(current.values[node.id] as { start: string })?.start ?? ''}
              end={(current.values[node.id] as { end: string })?.end ?? ''}
              onChangeStart={(startVal) =>
                setHistory((h) => {
                  const last = h[h.length - 1]
                  const prev = (last.values[node.id] as { start: string; end: string }) ?? { start: '', end: '' }
                  return [...h.slice(0, -1), { ...last, values: { ...last.values, [node.id]: { ...prev, start: startVal } } }]
                })
              }
              onChangeEnd={(endVal) =>
                setHistory((h) => {
                  const last = h[h.length - 1]
                  const prev = (last.values[node.id] as { start: string; end: string }) ?? { start: '', end: '' }
                  return [...h.slice(0, -1), { ...last, values: { ...last.values, [node.id]: { ...prev, end: endVal } } }]
                })
              }
              onNext={() => advance(current.values[node.id])}
              onBack={goBack}
            />
          )}

          {node.data.kind === 'month-counter' && (
            <MonthCounterTemplate
              data={node.data}
              month={(current.values[node.id] as { month: string })?.month ?? ''}
              days={(current.values[node.id] as { days: number })?.days ?? 4}
              onChangeMonth={(monthVal) =>
                setHistory((h) => {
                  const last = h[h.length - 1]
                  const prev = (last.values[node.id] as { month: string; days: number }) ?? { month: '', days: 4 }
                  return [...h.slice(0, -1), { ...last, values: { ...last.values, [node.id]: { ...prev, month: monthVal } } }]
                })
              }
              onChangeDays={(daysVal) =>
                setHistory((h) => {
                  const last = h[h.length - 1]
                  const prev = (last.values[node.id] as { month: string; days: number }) ?? { month: '', days: 4 }
                  return [...h.slice(0, -1), { ...last, values: { ...last.values, [node.id]: { ...prev, days: daysVal } } }]
                })
              }
              onNext={() => advance(current.values[node.id] ?? { month: '', days: 4 })}
              onBack={goBack}
            />
          )}

          {node.data.kind === 'free-text' && (
            <FreeTextTemplate
              data={node.data}
              value={(current.values[node.id] as string) ?? ''}
              onChange={(v) =>
                setHistory((h) => {
                  const last = h[h.length - 1]
                  return [...h.slice(0, -1), { ...last, values: { ...last.values, [node.id]: v } }]
                })
              }
              onNext={() => advance(current.values[node.id] ?? '')}
              onBack={goBack}
            />
          )}

          {node.data.kind === 'swipe-cards' && (
            <SwipeCardsTemplate
              data={node.data}
              candidates={computePlacePreviewCandidates(syntheticStateSoFar, node.data.cardCount)}
              onFinish={(liked, disliked) => advance({ liked, disliked })}
              onBack={goBack}
            />
          )}

          {node.data.kind === 'contact-form' && (
            <ContactFormTemplate
              data={node.data}
              name={(current.values[node.id] as { name: string })?.name ?? ''}
              email={(current.values[node.id] as { email: string })?.email ?? ''}
              onChangeName={(v) =>
                setHistory((h) => {
                  const last = h[h.length - 1]
                  const prev = (last.values[node.id] as { name: string; email: string }) ?? { name: '', email: '' }
                  return [...h.slice(0, -1), { ...last, values: { ...last.values, [node.id]: { ...prev, name: v } } }]
                })
              }
              onChangeEmail={(v) =>
                setHistory((h) => {
                  const last = h[h.length - 1]
                  const prev = (last.values[node.id] as { name: string; email: string }) ?? { name: '', email: '' }
                  return [...h.slice(0, -1), { ...last, values: { ...last.values, [node.id]: { ...prev, email: v } } }]
                })
              }
              onSubmit={() =>
                handleSubmit((current.values[node.id] as { name: string; email: string }) ?? { name: '', email: '' })
              }
              onBack={goBack}
              isSubmitting={isSubmitting}
            />
          )}

          {node.data.kind === 'closing' && <ClosingTemplate data={node.data} highlights={highlights} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
