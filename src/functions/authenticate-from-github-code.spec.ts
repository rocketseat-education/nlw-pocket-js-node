import { db } from '@/db'
import { users } from '@/db/schema'
import * as github from '@/modules/github'
import { makeUser } from '@/test/factories/make-user'
import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authenticateFromGithubCode } from './authenticate-from-github-code'

const GITHUB_USER_ID = 123456789

describe('authenticate from github code', () => {
  beforeEach(async () => {
    await db.delete(users).where(eq(users.externalAccountId, GITHUB_USER_ID))

    vi.mock('@/external/github')
  })

  it('should be able to authenticate from github code', async () => {
    vi.spyOn(github, 'getAccessTokenFromCode').mockImplementationOnce(
      async () => {
        return 'valid-access-token'
      }
    )

    vi.spyOn(github, 'getUserFromAccessToken').mockImplementationOnce(
      async () => {
        return {
          id: GITHUB_USER_ID,
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar_url: 'https://github.com/diego3g.png',
        }
      }
    )

    const sut = await authenticateFromGithubCode({
      code: 'sample-github-code',
    })

    expect(sut.token).toEqual(expect.any(String))

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.externalAccountId, GITHUB_USER_ID))

    expect(userOnDb.name).toEqual('John Doe')
  })

  it('should be able to authenticate when user already exists', async () => {
    const user = await makeUser({
      externalAccountId: GITHUB_USER_ID,
    })

    vi.spyOn(github, 'getAccessTokenFromCode').mockImplementationOnce(
      async () => {
        return 'valid-access-token'
      }
    )

    vi.spyOn(github, 'getUserFromAccessToken').mockImplementationOnce(
      async () => {
        return {
          id: GITHUB_USER_ID,
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar_url: 'https://github.com/diego3g.png',
        }
      }
    )

    const sut = await authenticateFromGithubCode({
      code: 'sample-github-code',
    })

    expect(sut.token).toEqual(expect.any(String))

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.externalAccountId, GITHUB_USER_ID))

    expect(userOnDb.name).toEqual(user.name)
  })
})
