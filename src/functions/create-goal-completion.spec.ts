import { makeGoal } from '@/test/factories/make-goal'
import { makeGoalCompletion } from '@/test/factories/make-goal-completion'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { createGoalCompletion } from './create-goal-completion'

describe('create goal completion', () => {
  it('should be able to complete a goal', async () => {
    const user = await makeUser()
    const goal = await makeGoal({ userId: user.id })

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

  it('should not be able to complete a goal more times then it expects', async () => {
    const user = await makeUser()

    const goal = await makeGoal({
      userId: user.id,
      desiredWeeklyFrequency: 1,
    })

    await makeGoalCompletion({ goalId: goal.id })

    await expect(
      createGoalCompletion({
        goalId: goal.id,
      })
    ).rejects.toThrow()
  })
})
