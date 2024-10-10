import { env } from '@/env'
import { SignJWT } from 'jose'

export async function authenticateUser({ userId }: { userId: string }) {
  const secret = new TextEncoder().encode(env.JWT_SECRET)

  const token = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setSubject(userId)
    .setExpirationTime('1d')
    .sign(secret)

  return { token }
}
