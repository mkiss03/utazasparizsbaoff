import { describe, expect, it } from 'vitest'
import { isOpenAt, parseTimeToMinutes, weekdayForDate } from '../time'

describe('time helpers', () => {
  it('parseTimeToMinutes helyesen számol', () => {
    expect(parseTimeToMinutes('09:00')).toBe(540)
    expect(parseTimeToMinutes('14:30')).toBe(870)
  })

  it('weekdayForDate a megadott naptól offsetteli a hét napját', () => {
    expect(weekdayForDate('2026-09-07', 0)).toBe('mon')
    expect(weekdayForDate('2026-09-07', 1)).toBe('tue')
    expect(weekdayForDate('2026-09-07', 6)).toBe('sun')
  })

  it('isOpenAt true, ha nincs megadva nyitvatartás', () => {
    expect(isOpenAt(undefined, 'mon', 600, 660)).toBe(true)
  })

  it('isOpenAt false, ha az adott napon zárva van', () => {
    expect(isOpenAt({ tue: 'closed' }, 'tue', 600, 660)).toBe(false)
  })

  it('isOpenAt false, ha a slot túlnyúlik a nyitvatartáson', () => {
    expect(isOpenAt({ mon: '09:00-18:00' }, 'mon', 1000, 1200)).toBe(false)
  })

  it('isOpenAt true, ha a slot a nyitvatartáson belül van', () => {
    expect(isOpenAt({ mon: '09:00-18:00' }, 'mon', 600, 660)).toBe(true)
  })
})
