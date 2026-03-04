function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace(/^#+/, '')
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return [r / 255, g / 255, b / 255]
}

function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function getLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const [r, g, b] = rgb.map(linearize)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getContrastRatio(hex1: string, hex2: string): number | null {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  if (l1 === null || l2 === null) return null
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export const WCAG_AA_THRESHOLD = 4.5

export function isWcagAaPass(ratio: number): boolean {
  return ratio >= WCAG_AA_THRESHOLD
}

export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(1)}:1`
}
