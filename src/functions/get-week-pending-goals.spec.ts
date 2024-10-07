import { makeGoal } from '@/test/factories/make-goal'
import { makeGoalCompletion } from '@/test/factories/make-goal-completion'
import { describe, expect, it } from 'vitest'
import { getWeekPendingGoals } from './get-week-pending-goals'

describe('get week pending goals', () => {
  it('should be able to get week pending goals', async () => {
    const goal1 = await makeGoal({
      title: 'Meditar',
      desiredWeeklyFrequency: 2,
    })
    const goal2 = await makeGoal({ title: 'Nadar', desiredWeeklyFrequency: 1 })
    const goal3 = await makeGoal({ title: 'Ler', desiredWeeklyFrequency: 3 })

    await makeGoalCompletion({ goalId: goal1.id })
    await makeGoalCompletion({ goalId: goal2.id })
    await makeGoalCompletion({ goalId: goal3.id })
    await makeGoalCompletion({ goalId: goal3.id })

    const result = await getWeekPendingGoals()

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
