import {
  calculateExperienceToNextLevel,
  calculateLevelFromExperience,
} from '@/modules/gamification'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

interface GetUserLevelAndExperienceRequest {
  userId: string
}

export async function getUserLevelAndExperience({
  userId,
}: GetUserLevelAndExperienceRequest) {
  const [{ experience }] = await db
    .select({
      experience: users.experience,
    })
    .from(users)
    .where(eq(users.id, userId))

  const level = calculateLevelFromExperience(experience)

  return {
    experience,
    level,
    experienceToNextLevel: calculateExperienceToNextLevel(level),
  }
}
