import { makeGoal } from '@/test/factories/make-goal'
import { makeGoalCompletion } from '@/test/factories/make-goal-completion'
import { makeUser } from '@/test/factories/make-user'
import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals, users } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)
  await db.delete(users)

  const user = await makeUser()

  const [goal1, goal2] = await Promise.all([
    makeGoal({
      userId: user.id,
      title: 'Acordar cedo',
      desiredWeeklyFrequency: 5,
    }),
    makeGoal({
      userId: user.id,
      title: 'Me exercitar',
      desiredWeeklyFrequency: 3,
    }),
    makeGoal({ userId: user.id, title: 'Meditar', desiredWeeklyFrequency: 1 }),
  ])

  const startOfWeek = dayjs().startOf('week')

  await makeGoalCompletion({
    goalId: goal1.id,
    createdAt: startOfWeek.toDate(),
  })
  await makeGoalCompletion({
    goalId: goal2.id,
    createdAt: startOfWeek.add(1, 'day').toDate(),
  })
}

seed()
  .then(() => {
    console.log('Database seeded!')
  })
  .finally(() => {
    client.end()
  })
