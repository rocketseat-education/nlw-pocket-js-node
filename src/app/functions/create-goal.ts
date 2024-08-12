import { db } from '@/db'
import { goals } from '@/db/schema'
import { z } from 'zod'

const createGoalRequest = z.object({
  title: z.string(),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})

export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: z.infer<typeof createGoalRequest>) {
  const [goal] = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  return { goal }
}
