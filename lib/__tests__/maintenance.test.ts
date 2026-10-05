import { describe, expect, it } from 'vitest'
import { getMaintenanceDecision, isMaintenanceMode } from '../maintenance'

const TOKEN = 'titkos-elonezet-123'

describe('getMaintenanceDecision', () => {
  it('kikapcsolt módban mindent átenged', () => {
    expect(getMaintenanceDecision({ enabled: false, pathname: '/' })).toBe('pass')
    expect(getMaintenanceDecision({ enabled: false, pathname: '/aszf' })).toBe('pass')
  })

  it('bekapcsolt módban a nyilvános oldalakat lezárja', () => {
    for (const pathname of ['/', '/aszf', '/impresszum', '/blog/valami', '/pricing', '/labs/planner']) {
      expect(getMaintenanceDecision({ enabled: true, pathname })).toBe('block')
    }
  })

  it('az admin felületet nyitva hagyja, de csak a valódi /admin útvonalakat', () => {
    expect(getMaintenanceDecision({ enabled: true, pathname: '/admin' })).toBe('pass')
    expect(getMaintenanceDecision({ enabled: true, pathname: '/admin/login' })).toBe('pass')
    expect(getMaintenanceDecision({ enabled: true, pathname: '/admin/services' })).toBe('pass')
    expect(getMaintenanceDecision({ enabled: true, pathname: '/administrator' })).toBe('block')
  })

  it('a robots.txt-t külön kezeli', () => {
    expect(getMaintenanceDecision({ enabled: true, pathname: '/robots.txt' })).toBe('robots')
  })

  it('helyes előnézeti paraméterre sütit ad, a sütivel átenged', () => {
    expect(
      getMaintenanceDecision({ enabled: true, pathname: '/', bypassToken: TOKEN, queryToken: TOKEN })
    ).toBe('grant-bypass')
    expect(
      getMaintenanceDecision({ enabled: true, pathname: '/aszf', bypassToken: TOKEN, cookieToken: TOKEN })
    ).toBe('pass')
  })

  it('hibás vagy hiányzó tokennel, illetve beállított token nélkül lezár', () => {
    expect(
      getMaintenanceDecision({ enabled: true, pathname: '/', bypassToken: TOKEN, queryToken: 'rossz' })
    ).toBe('block')
    expect(
      getMaintenanceDecision({ enabled: true, pathname: '/', bypassToken: TOKEN, cookieToken: 'rossz' })
    ).toBe('block')
    expect(
      getMaintenanceDecision({ enabled: true, pathname: '/', queryToken: '', cookieToken: '' })
    ).toBe('block')
    expect(
      getMaintenanceDecision({ enabled: true, pathname: '/', bypassToken: undefined, queryToken: undefined })
    ).toBe('block')
  })
})

describe('isMaintenanceMode', () => {
  it('csak MAINTENANCE_MODE=on esetén kapcsol be', () => {
    const original = process.env.MAINTENANCE_MODE
    try {
      delete process.env.MAINTENANCE_MODE
      expect(isMaintenanceMode()).toBe(false)
      process.env.MAINTENANCE_MODE = 'off'
      expect(isMaintenanceMode()).toBe(false)
      process.env.MAINTENANCE_MODE = 'on'
      expect(isMaintenanceMode()).toBe(true)
    } finally {
      if (original === undefined) delete process.env.MAINTENANCE_MODE
      else process.env.MAINTENANCE_MODE = original
    }
  })
})
