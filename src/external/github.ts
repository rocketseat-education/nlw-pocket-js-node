import { env } from '@/env'

interface AccessTokenResponse {
  access_token: string
  scope: string
  token_type: 'bearer'
}

export interface GetUserResponse {
  id: number
  name: string | null
  email: string | null
  avatar_url: string
}

export async function getAccessTokenFromCode(code: string) {
  const accessTokenUrl = new URL('https://github.com/login/oauth/access_token')

  accessTokenUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  accessTokenUrl.searchParams.set(
    'client_secret',
    env.GITHUB_OAUTH_CLIENT_SECRET
  )
  accessTokenUrl.searchParams.set('code', code)

  const response = await fetch(accessTokenUrl, {
    headers: {
      Accept: 'application/json',
    },
  })

  const { access_token }: AccessTokenResponse = await response.json()

  return access_token
}

export async function getUserFromAccessToken(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data: GetUserResponse = await response.json()

  return data
}
