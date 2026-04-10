import { rewardPool, type RewardId } from './content.ts'

export function buildWeightedWheel(pool = rewardPool): RewardId[] {
  const queue = pool.map((reward) => ({
    id: reward.id,
    remaining: reward.weight,
  }))
  const weightedWheel: RewardId[] = []
  const totalWeight = queue.reduce((sum, item) => sum + item.remaining, 0)

  while (weightedWheel.length < totalWeight) {
    queue.sort((left, right) => right.remaining - left.remaining)

    const nextReward =
      queue.find(
        (item) =>
          item.remaining > 0 && item.id !== weightedWheel[weightedWheel.length - 1],
      ) ?? queue.find((item) => item.remaining > 0)

    if (!nextReward) {
      break
    }

    weightedWheel.push(nextReward.id)
    nextReward.remaining -= 1
  }

  return weightedWheel
}

export const wheelSegments = buildWeightedWheel()

export function pickWeightedSegment(randomValue = Math.random()): {
  index: number
  rewardId: RewardId
} {
  const safeRandom = Math.min(Math.max(randomValue, 0), 0.999999)
  const index = Math.floor(safeRandom * wheelSegments.length)

  return {
    index,
    rewardId: wheelSegments[index],
  }
}

export function getSpinTargetDegrees(
  index: number,
  totalSegments = wheelSegments.length,
): number {
  const segmentAngle = 360 / totalSegments
  const centerAngle = index * segmentAngle + segmentAngle / 2

  return (360 - centerAngle + 360) % 360
}
