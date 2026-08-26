// LVR-XXXX-XXXX formátumú voucherkódok. Az ábécéből kihagyjuk a 0/O/1/I
// karaktereket, hogy telefonon átdiktálva/beírva ne lehessen összekeverni
// őket (Crockford Base32 szemléletű, de a spec szerinti egyszerűsített kör).
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

function randomChar(): string {
  const bytes = new Uint8Array(1)
  crypto.getRandomValues(bytes)
  return ALPHABET[bytes[0] % ALPHABET.length]
}

export function generateVoucherCode(): string {
  const part = () => Array.from({ length: 4 }, randomChar).join('')
  return `LVR-${part()}-${part()}`
}

export function generateVoucherCodes(count: number): string[] {
  const codes = new Set<string>()
  while (codes.size < count) {
    codes.add(generateVoucherCode())
  }
  return Array.from(codes)
}

export const ACTIVATION_WINDOW_HOURS = 48
export const MAX_DEVICE_SWAPS = 1
