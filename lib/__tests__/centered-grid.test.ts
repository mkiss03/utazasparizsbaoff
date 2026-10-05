import { describe, expect, it } from 'vitest'
import { centeredGrid } from '@/components/ui/centered-grid'

describe('centeredGrid', () => {
  it('egy elemnél keskeny, középre rendezett elrendezést ad', () => {
    const grid = centeredGrid(1)
    expect(grid.container).toContain('justify-center')
    expect(grid.container).toContain('max-w-md')
    expect(grid.item).toBe('w-full')
  })

  it('két és négy elemnél két oszlopot használ, üres harmadik oszlop nélkül', () => {
    for (const count of [2, 4]) {
      const grid = centeredGrid(count, { wideContainer: 'max-w-6xl' })
      expect(grid.container).toContain('max-w-4xl')
      expect(grid.container).not.toContain('max-w-6xl')
      expect(grid.item).toContain('md:w-[calc((100%-2rem)/2)]')
      expect(grid.item).not.toContain('lg:')
    }
  })

  it('három vagy több elemnél három oszlop, a megadott szélességgel', () => {
    for (const count of [3, 5, 37]) {
      const grid = centeredGrid(count, { wideContainer: 'mx-auto max-w-6xl' })
      expect(grid.container).toContain('mx-auto max-w-6xl')
      expect(grid.item).toContain('lg:w-[calc((100%-4rem)/3)]')
    }
    expect(centeredGrid(3).container).toBe('flex flex-wrap justify-center gap-6 md:gap-8')
  })
})
