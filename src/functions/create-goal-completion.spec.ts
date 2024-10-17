import { describe, it, expect } from 'vitest'
import { makeUser } from '../../tests/factories/make-user'
import { createGoal } from './create-goal'
import { makeGoal } from '../../tests/factories/make-goal'
import { createGoalCompletion } from './create-goal-completion'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

describe('create goal completion', () => {
  it('should be able to complete a goal', async () => {
    const user = await makeUser()
    const goal = await makeGoal({ userId: user.id })

    const result = await createGoalCompletion({
      userId: user.id,
      goalId: goal.id,
    })

    expect(result).toEqual({
      goalCompletion: expect.objectContaining({
        id: expect.any(String),
        goalId: goal.id,
      }),
    })
  })

  it('should not be able to complete a goal more time then it expects', async () => {
    const user = await makeUser()
    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 1 })

    await makeGoalCompletion({ goalId: goal.id })

    await expect(
      createGoalCompletion({
        userId: user.id,
        goalId: goal.id,
      })
    ).rejects.toThrow()
  })

  it('should increase user experience by 5 when completing a goal', async () => {
    const user = await makeUser({ experience: 0 })

    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 5 })

    await createGoalCompletion({
      userId: user.id,
      goalId: goal.id,
    })

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))

    expect(userOnDb.experience).toBe(5)
  })

  it('should increase user experience by 7 when fully completing a goal', async () => {
    const user = await makeUser({ experience: 0 })

    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 1 })

    await createGoalCompletion({
      userId: user.id,
      goalId: goal.id,
    })

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))

    expect(userOnDb.experience).toBe(7)
  })
})
