import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { getUser } from './get-user'

describe('get user', () => {
  it('should be able to get the user', async () => {
    const user = await makeUser()

    const result = await getUser({
      userId: user.id,
    })

    expect(result).toEqual({
      user: expect.objectContaining({
        id: user.id,
      }),
    })
  })
})
