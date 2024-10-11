import { SignJWT } from 'jose'
import { env } from '../env'

export async function authenticateUser(userId: string) {
  const secret = new TextEncoder().encode(env.JWT_SECRET)

  const token = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setExpirationTime('1d')
    .setIssuedAt()
    .sign(secret)

  return token
}
