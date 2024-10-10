import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { getUserLevelAndExperience } from './get-user-level-and-experience'

describe('user user level and experience', () => {
  it('should be able to get the user level and experience', async () => {
    const user = await makeUser({
      experience: 200,
    })

    const result = await getUserLevelAndExperience({
      userId: user.id,
    })

    expect(result).toEqual({
      experience: 200,
      level: 6,
      experienceToNextLevel: 74,
    })
  })
})
