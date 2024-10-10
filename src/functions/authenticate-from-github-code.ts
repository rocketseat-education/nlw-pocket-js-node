import { authenticateUser } from '@/external/auth'
import {
  getAccessTokenFromCode,
  getUserFromAccessToken,
} from '@/external/github'
import { type InferSelectModel, eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

interface AuthenticateFromGithubCodeRequest {
  code: string
}

export async function authenticateFromGithubCode({
  code,
}: AuthenticateFromGithubCodeRequest) {
  const accessToken = await getAccessTokenFromCode(code)
  const githubUser = await getUserFromAccessToken(accessToken)

  const result = await db
    .select()
    .from(users)
    .where(eq(users.externalAccountId, githubUser.id))

  const isUserAlreadyRegistered = result.length > 0

  let user: InferSelectModel<typeof users> | null = null

  if (isUserAlreadyRegistered) {
    user = result[0]
  }
  ;[user] = await db
    .insert(users)
    .values({
      name: githubUser.name,
      email: githubUser.email,
      avatarUrl: githubUser.avatar_url,
      externalAccountId: githubUser.id,
    })
    .returning()

  const { token } = await authenticateUser({ userId: user.id })

  return { token }
}
