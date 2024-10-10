import { makeGoal } from '@/test/factories/make-goal'
import { makeGoalCompletion } from '@/test/factories/make-goal-completion'
import { makeUser } from '@/test/factories/make-user'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getWeekSummary } from './get-week-summary'

describe('get week summary', () => {
  it('should be able to get week summary', async () => {
    const user = await makeUser()

    const weekStartsAt = dayjs(new Date(2024, 9, 10))
      .startOf('week')
      .toDate()

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

    const twoDaysAgo = dayjs().subtract(2, 'days')
    const yesterday = dayjs().subtract(1, 'day')

    await makeGoalCompletion({
      goalId: goal1.id,
      createdAt: twoDaysAgo.toDate(),
    })

    await makeGoalCompletion({
      goalId: goal2.id,
      createdAt: yesterday.toDate(),
    })

    await makeGoalCompletion({
      goalId: goal3.id,
      createdAt: yesterday.toDate(),
    })

    await makeGoalCompletion({ goalId: goal3.id, createdAt: new Date() })

    const result = await getWeekSummary({
      userId: user.id,
      weekStartsAt,
    })

    expect(result).toEqual({
      summary: {
        completed: 4,
        total: 6,
        goalsPerDay: {
          [twoDaysAgo.format('YYYY-MM-DD')]: expect.arrayContaining([
            expect.objectContaining({ title: 'Meditar' }),
          ]),
          [yesterday.format('YYYY-MM-DD')]: expect.arrayContaining([
            expect.objectContaining({ title: 'Nadar' }),
            expect.objectContaining({ title: 'Ler' }),
          ]),
          [dayjs().format('YYYY-MM-DD')]: expect.arrayContaining([
            expect.objectContaining({ title: 'Ler' }),
          ]),
        },
      },
    })
  })
})
