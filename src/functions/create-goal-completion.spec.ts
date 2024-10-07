import { makeGoal } from '@/test/factories/make-goal'
import { describe, expect, it } from 'vitest'
import { createGoalCompletion } from './create-goal-completion'

describe('create goal completion', () => {
  it('should be able to complete a goal', async () => {
    const goal = await makeGoal()

    const result = await createGoalCompletion({
      goalId: goal.id,
    })

    expect(result).toEqual({
      goalCompletion: expect.objectContaining({
        id: expect.any(String),
        goalId: goal.id,
      }),
    })
  })
})
