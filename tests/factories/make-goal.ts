import { faker } from '@faker-js/faker'

import { db } from '../../src/db'
import { goals } from '../../src/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export async function makeGoal(
  override: Partial<InferSelectModel<typeof goals>> &
    Pick<InferSelectModel<typeof goals>, 'userId'>
) {
  const [row] = await db
    .insert(goals)
    .values({
      title: faker.lorem.word(),
      desiredWeeklyFrequency: faker.number.int({ min: 1, max: 7 }),
      ...override,
    })
    .returning()

  return row
}
