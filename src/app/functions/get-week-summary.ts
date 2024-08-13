import { db } from '@/db'
import { goalCompletions, goals } from '@/db/schema'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, desc, eq, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export async function getWeekSummary() {
  const currentYear = dayjs().year()
  const currentWeek = dayjs().week()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${goals.createdAt}) <= ${currentYear}`,
          sql`EXTRACT(WEEK FROM ${goals.createdAt}) <= ${currentWeek}`
        )
      )
  )

  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        createdAt: goalCompletions.createdAt,
        completionDate: sql`DATE(${goalCompletions.createdAt})`.as(
          'completionDate'
        ),
      })
      .from(goalCompletions)
      .orderBy(desc(goalCompletions.createdAt))
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${goals.createdAt}) = ${currentYear}`,
          sql`EXTRACT(WEEK FROM ${goals.createdAt}) = ${currentWeek}`
        )
      )
  )

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completionDate: goalsCompletedInWeek.completionDate,
        completions: sql<
          { id: string; title: string; createdAt: string }[]
        > /* sql */`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${goalsCompletedInWeek.id},
            'title', ${goalsCompletedInWeek.title},
            'createdAt', ${goalsCompletedInWeek.createdAt}
          )
        )
      `.as('completions'),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completionDate)
  )

  type Summary = Record<
    string,
    { id: string; title: string; createdAt: string }[]
  >

  const [summary] = await db
    .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql<number> /*sql*/`
        (SELECT COUNT(*) FROM ${goalsCompletedInWeek})::DECIMAL
      `.mapWith(Number),
      total: sql<number> /*sql*/`
        (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})::DECIMAL
      `.mapWith(Number),
      goalsPerDay: sql<Summary> /*sql*/`
        JSON_OBJECT_AGG(${goalsCompletedByWeekDay.completionDate}, ${goalsCompletedByWeekDay.completions})
      `,
    })
    .from(goalsCompletedByWeekDay)

  return { summary }
}
