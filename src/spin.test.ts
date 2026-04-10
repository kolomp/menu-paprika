import { describe, expect, it } from 'vitest'
import { buildWeightedWheel, getSpinTargetDegrees, pickWeightedSegment } from './spin.ts'

describe('spin helpers', () => {
  it('builds the weighted wheel with the configured proportions', () => {
    const wheel = buildWeightedWheel()

    expect(wheel).toHaveLength(10)
    expect(wheel.filter((reward) => reward === 'tea')).toHaveLength(5)
    expect(wheel.filter((reward) => reward === 'coffee')).toHaveLength(3)
    expect(wheel.filter((reward) => reward === 'baklava')).toHaveLength(2)
  })

  it('maps random values to deterministic wheel segments', () => {
    expect(pickWeightedSegment(0)).toEqual({ index: 0, rewardId: 'tea' })
    expect(pickWeightedSegment(0.39)).toEqual({ index: 3, rewardId: 'coffee' })
    expect(pickWeightedSegment(0.49)).toEqual({ index: 4, rewardId: 'tea' })
    expect(pickWeightedSegment(0.95)).toEqual({ index: 9, rewardId: 'coffee' })
  })

  it('returns a valid landing angle for a segment', () => {
    const target = getSpinTargetDegrees(3)

    expect(target).toBeGreaterThanOrEqual(0)
    expect(target).toBeLessThan(360)
  })
})
