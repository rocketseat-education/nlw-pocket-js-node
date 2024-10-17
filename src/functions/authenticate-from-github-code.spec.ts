import { describe, it, beforeEach, vi, expect } from 'vitest'
import { authenticateFromGithubCode } from './authenticate-from-github-code'
import { db } from '../db'
import { users } from '../db/schema'
import { and, eq, ne } from 'drizzle-orm'
import * as github from '../modules/github-oauth'
import { makeUser } from '../../tests/factories/make-user'

describe('authenticate from github code', () => {
  beforeEach(() => {
    vi.mock('../modules/github-oauth')

    vi.clearAllMocks()
  })

  it('should be able to authenticate from github code', async () => {
    vi.spyOn(github, 'getUserFromAccessToken').mockResolvedValueOnce({
      id: 123456789,
      name: 'John Doe',
      email: null,
      avatar_url: 'https://github.com/diego3g.png',
    })

    const sut = await authenticateFromGithubCode({
      code: 'sample-github-code',
    })

    expect(sut.token).toEqual(expect.any(String))

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.externalAccountId, 123456789))

    expect(userOnDb.name).toEqual('John Doe')
  })

  it('should be able to authenticate with existing github user', async () => {
    const existing = await makeUser({
      name: 'Jane Doe',
    })

    await db
      .delete(users)
      .where(
        and(
          eq(users.externalAccountId, existing.externalAccountId),
          ne(users.id, existing.id)
        )
      )

    vi.spyOn(github, 'getUserFromAccessToken').mockResolvedValueOnce({
      id: existing.externalAccountId,
      name: 'John Doe',
      email: null,
      avatar_url: 'https://github.com/diego3g.png',
    })

    const sut = await authenticateFromGithubCode({
      code: 'sample-github-code',
    })

    expect(sut.token).toEqual(expect.any(String))

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.externalAccountId, existing.externalAccountId))

    expect(userOnDb.name).toEqual('Jane Doe')
  })
})
