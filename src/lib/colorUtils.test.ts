import { describe, it, expect } from 'vitest'
import {
  getLuminance,
  getContrastRatio,
  isWcagAaPass,
  formatContrastRatio,
} from './colorUtils'

describe('getLuminance', () => {
  it('returns 0 for black', () => {
    expect(getLuminance('#000000')).toBeCloseTo(0, 4)
  })

  it('returns 1 for white', () => {
    expect(getLuminance('#ffffff')).toBeCloseTo(1, 4)
  })

  it('returns null for invalid hex', () => {
    expect(getLuminance('notahex')).toBeNull()
  })

  it('handles double hash prefix', () => {
    const result = getLuminance('##ff0000')
    expect(result).not.toBeNull()
  })
})

describe('getContrastRatio', () => {
  it('returns 21:1 for black on white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })

  it('returns 1:1 for same color', () => {
    expect(getContrastRatio('#ff0000', '#ff0000')).toBeCloseTo(1, 2)
  })

  it('returns null for invalid inputs', () => {
    expect(getContrastRatio('invalid', '#ffffff')).toBeNull()
    expect(getContrastRatio('#ffffff', 'invalid')).toBeNull()
  })

  it('is symmetric', () => {
    const r1 = getContrastRatio('#ff0000', '#0000ff')
    const r2 = getContrastRatio('#0000ff', '#ff0000')
    expect(r1).toEqual(r2)
  })
})

describe('isWcagAaPass', () => {
  it('passes for ratio >= 4.5', () => {
    expect(isWcagAaPass(4.5)).toBe(true)
    expect(isWcagAaPass(7)).toBe(true)
    expect(isWcagAaPass(21)).toBe(true)
  })

  it('fails for ratio < 4.5', () => {
    expect(isWcagAaPass(4.4)).toBe(false)
    expect(isWcagAaPass(1)).toBe(false)
    expect(isWcagAaPass(3.5)).toBe(false)
  })
})

describe('formatContrastRatio', () => {
  it('formats correctly', () => {
    expect(formatContrastRatio(4.5)).toBe('4.5:1')
    expect(formatContrastRatio(21)).toBe('21.0:1')
    expect(formatContrastRatio(1.234)).toBe('1.2:1')
  })
})
