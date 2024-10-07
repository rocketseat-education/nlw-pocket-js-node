import { describe, expect, it } from 'vitest'
import { createGoal } from './create-goal'

describe('create goal', () => {
  it('should be able to create a new goal', async () => {
    const result = await createGoal({
      title: 'Example goal',
      desiredWeeklyFrequency: 5,
    })

    expect(result).toEqual({
      goal: expect.objectContaining({
        id: expect.any(String),
        title: 'Example goal',
        desiredWeeklyFrequency: 5,
      }),
    })
  })
})
