import { describe, it, expect } from 'vitest'
import { makeUser } from '../../tests/factories/make-user'
import { createGoal } from './create-goal'

describe('create goal', () => {
  it('should be able to create a new goal', async () => {
    const user = await makeUser()

    const result = await createGoal({
      userId: user.id,
      title: 'Example Goal',
      desiredWeeklyFrequency: 5,
    })

    expect(result).toEqual({
      goal: expect.objectContaining({
        id: expect.any(String),
        title: 'Example Goal',
        desiredWeeklyFrequency: 5,
      }),
    })
  })
})
