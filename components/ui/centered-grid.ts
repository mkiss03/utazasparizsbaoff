// Kártyalisták elrendezése az elemszám szerint, hogy ne maradjon üres oszlop:
// 1 elem keskenyen középen, 2 vagy 4 elem két oszlopban, egyébként három
// oszlop. A hiányos utolsó sor középre kerül (flex-wrap + rögzített
// kártyaszélesség). A szélességek md-től a gap-8 (2rem) hézaggal számolnak.
const ITEM_WIDTHS = {
  1: 'w-full',
  2: 'w-full md:w-[calc((100%-2rem)/2)]',
  3: 'w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]',
} as const

const CONTAINER_WIDTHS = {
  1: 'mx-auto max-w-md',
  2: 'mx-auto max-w-4xl',
} as const

export function centeredGrid(count: number, options: { wideContainer?: string } = {}) {
  const columns = count <= 1 ? 1 : count === 2 || count === 4 ? 2 : 3
  const width = columns === 3 ? options.wideContainer ?? '' : CONTAINER_WIDTHS[columns]

  return {
    container: `flex flex-wrap justify-center gap-6 md:gap-8 ${width}`.trim(),
    item: ITEM_WIDTHS[columns],
  }
}
