import { db } from '../../src/db'
import { goalCompletions } from '../../src/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export async function makeGoalCompletion(
  override: Partial<InferSelectModel<typeof goalCompletions>> &
    Pick<InferSelectModel<typeof goalCompletions>, 'goalId'>
) {
  const [row] = await db.insert(goalCompletions).values(override).returning()

  return row
}
