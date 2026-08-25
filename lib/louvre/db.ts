'use client'

import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { TourState } from './types'

const DB_NAME = 'louvre-tour'
const DB_VERSION = 1
const STORE = 'state'
const STATE_KEY = 'tour-state'

interface LouvreDB extends DBSchema {
  state: {
    key: string
    value: TourState
  }
}

let dbPromise: Promise<IDBPDatabase<LouvreDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<LouvreDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE)
        }
      },
    })
  }
  return dbPromise
}

function randomClientId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function createInitialState(manifestVersion: string): TourState {
  return {
    manifestVersion,
    clientId: randomClientId(),
    emailCaptured: false,
    downloadComplete: false,
    stations: {},
    collectedCodewords: [],
    bonusUnlocked: false,
    updatedAt: Date.now(),
  }
}

export async function loadTourState(manifestVersion: string): Promise<TourState> {
  const db = await getDB()
  const existing = await db.get(STORE, STATE_KEY)
  if (existing) return existing
  const fresh = createInitialState(manifestVersion)
  await db.put(STORE, fresh, STATE_KEY)
  return fresh
}

export async function saveTourState(state: TourState): Promise<void> {
  const db = await getDB()
  await db.put(STORE, { ...state, updatedAt: Date.now() }, STATE_KEY)
}

export async function clearTourState(): Promise<void> {
  const db = await getDB()
  await db.delete(STORE, STATE_KEY)
}
