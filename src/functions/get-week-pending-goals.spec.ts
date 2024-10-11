import { describe, it, expect } from 'vitest'
import { makeUser } from '../../tests/factories/make-user'
import { makeGoal } from '../../tests/factories/make-goal'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'
import { getWeekPendingGoals } from './get-week-pending-goals'

describe('get week pending goals', () => {
  it('should be able to get week pending goals', async () => {
    const user = await makeUser()

    const goal1 = await makeGoal({
      userId: user.id,
      title: 'Meditar',
      desiredWeeklyFrequency: 2,
    })
    const goal2 = await makeGoal({
      userId: user.id,
      title: 'Nadar',
      desiredWeeklyFrequency: 1,
    })
    const goal3 = await makeGoal({
      userId: user.id,
      title: 'Ler',
      desiredWeeklyFrequency: 3,
    })

    await makeGoalCompletion({ goalId: goal1.id })
    await makeGoalCompletion({ goalId: goal2.id })
    await makeGoalCompletion({ goalId: goal3.id })
    await makeGoalCompletion({ goalId: goal3.id })

    const result = await getWeekPendingGoals({
      userId: user.id,
    })

    expect(result).toEqual({
      pendingGoals: expect.arrayContaining([
        expect.objectContaining({
          title: 'Meditar',
          desiredWeeklyFrequency: 2,
          completionCount: 1,
        }),
        expect.objectContaining({
          title: 'Nadar',
          desiredWeeklyFrequency: 1,
          completionCount: 1,
        }),
        expect.objectContaining({
          title: 'Ler',
          desiredWeeklyFrequency: 3,
          completionCount: 2,
        }),
      ]),
    })
  })
})
